const Usuario = require('../Schemas/userSchema')
const Post = require('../Schemas/postSchema')
const controller = {}
const mongoose = require('../db/mongo.db').mongoose;
const getUsers = async (req, res) => {
  const data = await Usuario.find({})
    .populate('postId', 'descripcion fecha pathImg userId comentarios')
    .populate('postId.userId', 'nickname email pathImgPerfil')
    .populate('seguidores', 'nickname email pathImgPerfil')
    .populate('seguidos', 'nickname email pathImgPerfil');
    // Filtrar los comentarios visibles
  for (let user of data) {  
    user.postId.forEach(post => {
      post.comentarios = post.comentarios.filter(comentario => comentario.visible);
      post.comentarios = post.comentarios.map(comentario => ({
        _id: comentario._id,
        descripcion: comentario.descripcion,
        fecha: comentario.fecha,
        userId: comentario.userId
      }));
    });
  }
  res.status(200).json(data);
  

};
controller.getUsers = getUsers

const getUserById = async (req, res) => {
  const data = await Usuario.findById(req.params.id).populate('postId', 'descripcion fecha pathImg userId comentarios')
    .populate('postId.userId', 'nickname email pathImgPerfil')
    .populate('seguidores', 'nickname email pathImgPerfil')
    .populate('seguidos', 'nickname email pathImgPerfil');
  res.status(200).json(data);
};
controller.getUserById = getUserById
const createUser = async (req, res) => {
  try {
    const newUser = await Usuario.create(req.body);
    res.status(201).json(newUser);
  } catch (e) {
    res.status(400).json({ error: e });
  }
};
controller.createUser = createUser
const updateUser = async (req, res) => {
  const { id } = req.params; 
  try { 
    const updatedUser = await Usuario.findByIdAndUpdate(
        id, 
        req.body, 
        { new: true } 
    );
    if (!updatedUser) {
        return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json(updatedUser);
    } catch (error) {
    res.status(400).json({ error: "Error al actualizar el usuario", details: error.message });
  }
};
controller.updateUser = updateUser
const deleteById = async (req, res) => {
  const data = await Usuario.findById(req.params.id);
  const removed = await data.destroy();
  res.status(200).json(removed);
};

controller.deleteById = deleteById
const getPostsByUser = async (req, res) => {
  const { id } = req.params; // ID del usuario
  try {
    // Verificar si el usuario existe
    const usuarioExistente = await Usuario.findById(id);
    if (!usuarioExistente) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    // Buscar los posts del usuario
    const posts = await Post.find({ userId: id }).populate('userId', 'nickname email');
    if (posts.length === 0) {
      return res.status(404).json({ message: "No se encontraron posts para este usuario" });
    }
    for (let post of posts) {
      post.comentarios = post.comentarios.filter(comentario => comentario.visible);
    }
    for (let post of posts) {
      post.comentarios = post.comentarios.map(comentario => ({
        _id: comentario._id,
        descripcion: comentario.descripcion,
        fecha: comentario.fecha,
        userId: comentario.userId
      }));
    }
    res.status(200).json(posts);
    
} catch (error) {
    res.status(500).json({ message: "Error al obtener los posts del usuario", error: error.message });
}
};
controller.getPostsByUser = getPostsByUser
const addPost = async (req, res) => {  
    const { id } = req.params; // ID del usuario
    const { descripcion, fecha, pathImg,comentarios} = req.body; // Datos del nuevo post
    try {
        // Verificar si el usuario existe
        const usuarioExistente = await Usuario.findById(id);
        if (!usuarioExistente) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Crear el nuevo post
        const nuevoPost = new Post({
            descripcion,
            fecha,
            pathImg,
            userId: id, // Asociar el post al usuario
            comentarios: comentarios || [] // Asociar comentarios si existen
        });

        // Guardar el post en la base de datos
        const postGuardado = await nuevoPost.save();

        // Agregar el ID del post al array de posts del usuario
        usuarioExistente.postId.push(postGuardado._id);
        await usuarioExistente.save();

        res.status(201).json(postGuardado);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el post", error: error.message });
    }    
}
controller.addPost = addPost
const getCommentsByUser = async (req, res) => {
  const { id } = req.params; // ID del usuario
  try {
    // Verificar si el usuario existe
    const usuarioExistente = await Usuario.findById(id);
    if (!usuarioExistente) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Buscar en todos los posts del sistema
    // y filtrar los comentarios del usuario
    const posts = await Post.find({ "comentarios.userId": id })
      .populate('comentarios.userId', 'nickname email') // Poblamos los datos del usuario en los comentarios
      .select('comentarios'); // Solo seleccionamos los comentarios    
    if (posts.length === 0) {
      return res.status(404).json({ message: "No se encontraron posts para este usuario" });
    }

    // Filtrar los comentarios visibles
    const comentariosVisibles = posts.flatMap(post => 
      post.comentarios.filter(comentario => comentario.visible)
    );

    res.status(200).json(comentariosVisibles);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los comentarios del usuario", error: error.message });
  }
}
controller.getCommentsByUser = getCommentsByUser
const addCommentsByUser = async (req, res) => {
  const { id } = req.params; // ID del usuario
  const { postId, descripcion } = req.body; // Datos del nuevo comentario
  try {
    // Verificar si el usuario existe
    const usuarioExistente = await Usuario.findById(id);
    if (!usuarioExistente) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }  
    // Verificar si el post existe
    const postExistente = await Post.findById(postId);
    if (!postExistente) {
      return res.status(404).json({ message: "Post no encontrado" });
    }
    // Crear el nuevo comentario
    const nuevoComentario = {
      descripcion,
      fecha: Date.now(),  // Fecha actual
      visible: true, // Por defecto, los comentarios son visibles
      userId: id // Asociar el comentario al usuario
    };
    // Agregar el comentario al post
    postExistente.comentarios.push(nuevoComentario);
    await postExistente.save();
    // Agregar el ID del comentario al array de comentarios del usuario
    usuarioExistente.comentarios.push(nuevoComentario);
    await usuarioExistente.save();
    res.status(201).json(nuevoComentario);
  } catch (error) {
    res.status(500).json({ message: "Error al agregar el comentario", error:error.message });
  }
} 
controller.addCommentsByUser = addCommentsByUser
const getFollowers = async (req, res) => {
  const { id } = req.params; // ID del usuario
  try {
    // Verificar si el usuario existe
    const usuarioExistente = await Usuario.findById(id).populate('seguidores', 'nickname email pathImgPerfil');
    if (!usuarioExistente) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    // Retornar los seguidores del usuario
    res.status(200).json(usuarioExistente.seguidores);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los seguidores del usuario", error: error.message });
  }
}
controller.getFollowers = getFollowers
const getFollowing = async (req, res) => {
  const { id } = req.params; // ID del usuario
  try {
    // Verificar si el usuario existe
    const usuarioExistente = await Usuario.findById(id).populate('seguidos', 'nickname email pathImgPerfil');
    if (!usuarioExistente) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    // Retornar los usuarios que sigue
    res.status(200).json(usuarioExistente.seguidos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios que sigue", error: error.message });
  }
} 
controller.getFollowing = getFollowing
const followUser = async (req, res) => {
  const { id } = req.params; // ID del usuario que sigue
  const { followId } = req.body; // ID del usuario a seguir
  try {
    // Verificar si el usuario existe
    const usuarioExistente = await Usuario.findById(id);
    if (!usuarioExistente) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    // Verificar si el usuario a seguir existe
    const usuarioAFollow = await Usuario.findById(followId);
    if (!usuarioAFollow) {
      return res.status(404).json({ message: "Usuario a seguir no encontrado" });
    }
    // Verificar si ya sigue al usuario
    if (usuarioExistente.seguidos.includes(followId)) {
      return res.status(400).json({ message: "Ya sigues a este usuario" });
    }
    // Agregar al usuario a la lista de seguidos
    usuarioExistente.seguidos.push(followId);
    await usuarioExistente.save();
    // Agregar al usuario a la lista de seguidores del usuario seguido
    usuarioAFollow.seguidores.push(id);
    await usuarioAFollow.save();
    res.status(200).json({ message: "Usuario seguido correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al seguir al usuario", error: error.message });
  }
}
controller.followUser = followUser
const unfollowUser = async (req, res) => {
  const { id } = req.params; // ID del usuario que deja de seguir
  const { followId } = req.body; // ID del usuario a dejar de seguir
  try {
    // Verificar si el usuario existe
    const usuarioExistente = await Usuario.findById(id);
    if (!usuarioExistente) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    // Verificar si el usuario a dejar de seguir existe
    const usuarioAUnfollow = await Usuario.findById(followId);
    if (!usuarioAUnfollow) {
      return res.status(404).json({ message: "Usuario a dejar de seguir no encontrado" });
    }
    // Verificar si ya no sigue al usuario
    if (!usuarioExistente.seguidos.includes(followId)) {
      return res.status(400).json({ message: "No sigues a este usuario" });
    }
    // Eliminar al usuario de la lista de seguidos
    usuarioExistente.seguidos.pull(followId);
    await usuarioExistente.save();
    // Eliminar al usuario de la lista de seguidores del usuario seguido
    usuarioAUnfollow.seguidores.pull(id);
    await usuarioAUnfollow.save();
    res.status(200).json({ message: "Usuario dejado de seguir correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al dejar de seguir al usuario", error: error.message });
  }
}
controller.unfollowUser = unfollowUser
module.exports = controller