const Post = require("../Schemas/postSchema");
const Usuario = require("../Schemas/userSchema");
const controller = {};
const mongoose = require("../db/mongo.db").mongoose;
const redisClient = require("../config/redisClient");
const MAX_MESES = parseInt(process.env.TIEMPO_COMENTARIO_VISIBLE) || 6;

const getAllPost = async (req, res) => {
  const cachedPosts = await redisClient.get("posts");
  if (cachedPosts) {
    return res.status(200).json(JSON.parse(cachedPosts));
  } //else {
  try{
    const posts = await Post.find().populate(
      "userId",
      "nickname email pathImgPerfil"
    );
    const ahora = new Date();
    const postsFiltrados = posts.map(post => {
      const comentariosFiltrados = post.comentarios.filter(comentario => {
        const fechaComentario = new Date(comentario.fecha);
        const tiempoTranscurrido = ahora - fechaComentario;
        const mesesTranscurridos = tiempoTranscurrido / (1000 * 60 * 60 * 24 * 30.44);
        return mesesTranscurridos < MAX_MESES;
      });
      return{
        ...post.toObject(),
        comentarios: comentariosFiltrados,
      };
    });
    await redisClient.set("posts", JSON.stringify(postsFiltrados), {
      EX: 3600, // Expira en 1 hora
      NX: true, // Solo establece si no existe
    });
    return res.status(200).json(postsFiltrados);
  } catch(error){
    console.error(error);
    res.status(500).json({mensaje: "Error al obtener los posteos"})
  }
};

controller.getAllPost = getAllPost;

const getPostById = async (req, res) => {
  const { id } = req.params;
  const cachedPost = await redisClient.get(`post:${id}`);
  if (cachedPost) {
    return res.status(200).json(JSON.parse(cachedPost));
  } //else {
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ mensaje: "Posteo no encontrado" });
    }    
    const ahora = new Date();
    const comentariosFiltrados = post.comentarios.filter(comentario => {
      const fechaComentario = new Date(comentario.fecha);
      const tiempoTranscurrido = ahora - fechaComentario;
      const mesesTranscurridos = tiempoTranscurrido / (1000 * 60 * 60 * 24 * 30.44);
      return mesesTranscurridos < MAX_MESES;
    });
    const posteoFiltrado = {
      ...post.toObject(),
      comentarios: comentariosFiltrados,
    };

    await redisClient.set(`post:${id}`, JSON.stringify(posteoFiltrado), {
      EX: 3600,
      NX: true, 
    });
    res.status(200).json(posteoFiltrado);
  } catch(error){
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener el posteo" });
  }
};

controller.getPostById = getPostById;

const createPost = async (req, res) => {
  let postData = { ...req.body };

  if (postData.nickname) {
    const user = await Usuario.findOne({ nickname: postData.nickname });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    postData.userId = user._id;
    delete postData.nickname;
  }

  const post = await Post.create(postData);

  // Relacionar post con el usuario
  await Usuario.findByIdAndUpdate(
    postData.userId,
    { $push: { postId: post._id } }
  );

  await redisClient.del("posts");
  res.status(201).json(post);
};

controller.createPost = createPost;

const updatePost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json(post);
  await redisClient.del(`post:${id}`); // Limpiar la caché del post actualizado
  await redisClient.del("posts"); // Limpiar la caché de posts en Redis
  if (!post) {
    return res.status(404).json({ message: "Post no encontrado" });
  }
};
controller.updatePost = updatePost;

const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post eliminado con éxito" });
    await redisClient.del(`post:${id}`); // Limpiar la caché del post eliminado
    await redisClient.del("posts"); // Limpiar la caché de posts en Redis
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar el post", details: error.message });
  }
};

controller.deletePost = deletePost;

const getCommentsByPost = async (req, res) => {
  const _id = new mongoose.Types.ObjectId(req.params.id);
  const cachedComments = await redisClient.get(`comments:${_id}`);
  if (cachedComments) {
    return res.status(200).json(JSON.parse(cachedComments));
  }
  if (!_id) {
    return res.status(400).json({ message: "ID de post inválido" });
  }
  try {
    const post = await Post.aggregate([
      {
        $match: { _id },
      },
      {
        $project: {
          _id: 0,
          descripcion: 1,
          fecha: 1,
          comentarios: {
            $filter: {
              input: "$comentarios",
              as: "comentario",
              cond: { $eq: ["$$comentario.visible", true] }, // Filtrar solo los comentarios visibles
            },
          },
        },
      },
    ]);
    res.status(200).json(post);
    await redisClient.set(`comments:${_id}`, JSON.stringify(post), {
      EX: 3600, // Expira en 1 hora
      NX: true, // Solo establece si no existe
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al obtener comentarios", error: err });
  }
};

controller.getCommentsByPost = getCommentsByPost;

const addComments = async (req, res) => {
  const { id } = req.params;
  await redisClient.del(`comments:${id}`); // Limpiar la caché de comentarios del post
  try {
    const post = await Post.findByIdAndUpdate(
      id,
      { $push: { comentarios: req.body } },
      { new: true }
    );

    res.status(201).json(post.comentarios[post.comentarios.length - 1]);
  } catch (err) {
    res.status(400).json({
      message: "Error al asociar comentarios al producto",
      error: err,
    });
  }
};

controller.addComments = addComments;

const getUsersByPost = async (req, res) => {
  const _id = new mongoose.Types.ObjectId(req.params.id);
  const cachedUsers = await redisClient.get(`usersByPost:${_id}`);
  if (cachedUsers) {
    return res.status(200).json(JSON.parse(cachedUsers));
  }
  try {
    const post = await Post.aggregate([
      {
        $match: { _id },
      },
      {
        $lookup: {
          from: "usuarios",
          localField: "_id",
          foreignField: "postId",
          as: "usuarios",
        },
      },
      {
        $project: {
          _id: 1,
          descripcion: 1,
          fecha: 1,
          "usuarios._id": 1,
          "usuarios.nickname": 1,
          "usuarios.email": 1,
          "usuarios.password": 1,
        },
      },
    ]);
    await redisClient.set(`usersByPost:${_id}`, JSON.stringify(post), {
      EX: 3600, // Expira en 1 hora
      NX: true, // Solo establece si no existe
    });
    res.status(200).json(post);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al obtener fabricantes", error: err });
  }
};

controller.getUsersByPost = getUsersByPost;

const addUsersByPost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    // Verificar si el usuario existe
    const usuarioExistente = await Usuario.findById(userId);
    if (!usuarioExistente) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualizar el post con el usuario dado
    const updatedPost = await Post.findOneAndUpdate(
      { _id: id },
      { $addToSet: { userId: userId } }, // Agregar el userId al array userId del post
      { new: true }
    );

    // Agregar el post al usuario
    await Usuario.findByIdAndUpdate(
      userId,
      { $addToSet: { postId: id } }, // Agregar el id del post al array postId del usuario
      { new: true }
    );
    await redisClient.del(`usersByPost:${id}`); // Limpiar la caché de usuarios por post
    res.status(201).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
controller.addUsersByPost = addUsersByPost;

const getAllComments = async (req, res) => {
  try {
    const posts = await Post.find({}, { comentarios: 1 }).populate('comentarios.userId', 'nickname email pathImgPerfil');
    
    // Aplanar todos los comentarios en un solo array
    const allComments = posts.flatMap(post => 
      post.comentarios.map(com => ({
        ...com.toObject(),
        postId: post._id
      }))
    );

    res.status(200).json(allComments);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los comentarios", error: error.message });
  }
};
controller.getAllComments = getAllComments;


const updateComment = async (req, res) => {
  const { idPost, idComment } = req.params;
  const { texto, visible } = req.body;

  try {
    const post = await Post.findById(idPost);
    if (!post) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    const comment = post.comentarios.id(idComment);
    if (!comment) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }

    if (texto !== undefined) comment.texto = texto;
    if (visible !== undefined) comment.visible = visible;

    await post.save();
    res.status(200).json({ message: "Comentario actualizado", comment });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el comentario", error: error.message });
  }
};
controller.updateComment = updateComment;


const deleteComment = async (req, res) => {
  const { idPost, idComment } = req.params;

  try {
    const post = await Post.findById(idPost);
    if (!post) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    const comment = post.comentarios.id(idComment);
    if (!comment) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }

    // ✅ Elimina el comentario embebido correctamente
    comment.deleteOne(); // usa deleteOne() en vez de remove()

    await post.save();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el comentario",
      error: error.message,
    });
  }
};
controller.deleteComment = deleteComment;

module.exports = controller;
