const Usuario = require('../Schemas/userSchema')
const Post = require('../Schemas/postSchema')
const controller = {}
const mongoose = require('../db/mongo.db').mongoose;
const getUsers = async (req, res) => {
  const data = await Usuario.find({});
  res.status(200).json(data);
};
controller.getUsers = getUsers

const getUserById = async (req, res) => {
  const data = await Usuario.findById(req.params.id);
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
module.exports = controller