const Tag = require('../Schemas/tagSchema')
const Post = require('../Schemas/postSchema')
const controller = {}
const mongoose = require('../db/mongo.db').mongoose;
const getTags = async (req, res) => {
  const data = await Tag.find({});
  res.status(200).json(data);
};
controller.getTags = getTags

const getTagById = async (req, res) => {
  const data = await Tag.findById(req.params.id);
  res.status(200).json(data);
};
controller.getTagById = getTagById
const createTag = async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    res.status(201).json(newTag);
  } catch (e) {
    res.status(400).json({ error: e });
  }
};
controller.createTag = createTag
const updateTag = async (req, res) => {
  const { id } = req.params; 
  try { 
    const updatedTag = await Tag.findByIdAndUpdate(
        id, 
        req.body, 
        { new: true } 
    );
    if (!updatedTag) {
        return res.status(404).json({ error: "Tag no encontrado" });
    }
    res.status(200).json(updatedTag);
    } catch (error) {
    res.status(400).json({ error: "Error al actualizar el Tag", details: error.message });
  }
};
controller.updateTag = updateTag
const deleteById = async (req, res) => {
  const data = await Tag.findById(req.params.id);
  const removed = await data.destroy();
  res.status(200).json(removed);
};

controller.deleteById = deleteById
const getPostsByTag = async (req, res) => {
  const { id } = req.params;
  try {
    const tagExistente = await Tag.findById(id);
    if (!tagExistente) {
      return res.status(404).json({ message: "Tag no encontrado" });
    }
    const posts = await Post.find({ tags: id }).populate('tags', 'nombre');
    if (posts.length === 0) {
      return res.status(404).json({ message: "No se encontraron posts para este tag" });
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
controller.getPostsByTag = getPostsByTag
module.exports = controller