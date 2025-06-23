const Post = require("../Schemas/postSchema")
const Usuario = require("../Schemas/userSchema")
const controller = {}
const mongoose = require("../db/mongo.db").mongoose;

const getAllPost = async (req,res) => {
    const posts = await Post.find({}).populate("tags", "nombre") // Esto es para obtener los nombres de tags de cada post
    //obtener los nombres de tags de cada post
    // const posts = await Post.find({}).populate("tags")
    // const posts = await Post.find({}).populate({"path": "tags", "model": "Tag"})
    res.status(200).json(posts)
}

controller.getAllPost = getAllPost

const getPostById = async (req,res) =>{
    const {id} = req.params
    const post = await Post.findById(id)
    res.status(200).json(post)
}

controller.getPostById = getPostById

const createPost = async (req,res) => {
    const post = await Post.create(req.body)
    res.status(201).json(post)
}

controller.createPost = createPost

const updatePost = async (req,res) =>{
    const {id} = req.params
    const post = await Post.findByIdAndUpdate(id, req.body, {new: true})
    res.status(200).json(post)
}

controller.updatePost = updatePost

const deletePost = async (req,res) =>{
    const {id} = req.params
    try{
        const post = await Post.findByIdAndDelete(id)
        res.status(200).json({message: "Post eliminado con éxito"})
    } catch (error){
        res.status(500).json({ error: "Error al eliminar el post", details: error.message })
    }
    
}

controller.deletePost = deletePost

const getCommentsByPost= async (req,res) => {
  const _id = new mongoose.Types.ObjectId(req.params.id)
  try{
    const post = await Post.aggregate([
      {
        $match: {_id}
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
              cond: { $eq: ["$$comentario.visible", true] } // Filtrar solo los comentarios visibles
            }
          },
        },
      },
    ])

    res.status(200).json(post)

  }catch (err){
    res.status(500).json({ message: "Error al obtener comentarios", error: err });
  }
}

controller.getCommentsByPost = getCommentsByPost

const addComments = async (req,res) =>{
  const {id} = req.params
  try {
    const post = await Post.findByIdAndUpdate(
      id,
      {$push : {comentarios: req.body}},
      {new: true}
    );

    
    res.status(201).json(post.comentarios[post.comentarios.length - 1]);
  } catch (err) {
    res.status(400).json({ message: "Error al asociar comentarios al producto", error: err });
  }

}

controller.addComments = addComments

const getUsersByPost = async (req,res) => {
  const _id = new mongoose.Types.ObjectId(req.params.id)
  try{
    const post = await Post.aggregate([
      {
        $match: {_id}
      },
      {
        $lookup: {
          from: 'usuarios',
          localField: "_id",
          foreignField: "postId",
          as: "usuarios"
        }
      },
      {
        $project: {
          _id: 1,
          descripcion: 1,
          fecha: 1,
          "usuarios._id": 1,
          "usuarios.nickname": 1,
          "usuarios.email":1,
          "usuarios.password": 1,
        },
      },
    ])
    res.status(200).json(post)

  }catch (err){
    res.status(500).json({ message: "Error al obtener fabricantes", error: err });
  }
}

controller.getUsersByPost = getUsersByPost

const addUsersByPost = async (req,res) => {
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

    res.status(201).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

controller.addUsersByPost = addUsersByPost

module.exports = controller