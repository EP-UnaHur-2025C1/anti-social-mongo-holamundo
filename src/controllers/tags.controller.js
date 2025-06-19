const Tag = require('../Schemas/tagSchema')
const Post = require('../Schemas/postSchema')
const controller = {}
const mongoose = require('../db/mongo.db').mongoose;

const getTags = async (req, res) => {
  try {
    const tags = await Tag.find({}).populate('postId', {
      postId: 1,
      descripcion: 1,
      fecha: 1,
      pathImg: 1,
      userId: 1,
      comentarios: { $elemMatch: { visible: true } } // Solo comentarios visibles
    }).populate('postId.userId', 'nickname email pathImgPerfil'); // Población de userId en los posts
    if (!tags || tags.length === 0) {
      return res.status(404).json({ message: "No se encontraron tags" });
    }
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los Tags", details: error.message });
  }
};
controller.getTags = getTags
const getTagById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }
  try {
    const tag = await Tag.findById(id).populate('postId', {
      postId: 1,
      descripcion: 1,
      fecha: 1,
      pathImg: 1,
      userId: 1,
      comentarios: { $elemMatch: { visible: true } } // Solo comentarios visibles
    }).populate('postId.userId', 'nickname email pathImgPerfil'); // Población de userId en los posts
    if (!tag) {
      return res.status(404).json({ error: "Tag no encontrado" });
    }
    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el Tag", details: error.message });
  }
};
controller.getTagById = getTagById
const createTag = async (req, res) => {
  const { nombre, postId } = req.body;
  if (!nombre || !postId) {
    return res.status(400).json({ error: "Faltan datos requeridos" });
  }
  try {
    const tagExistente = await Tag.findOne({ nombre });
    if (tagExistente) {
      return res.status(400).json({ error: "El tag ya existe" });
    }
    const newTag = new Tag({ nombre, postId });
    const savedTag = await newTag.save();
    res.status(201).json(savedTag);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el Tag", details: error.message });
  }
};
controller.createTag = createTag
const updateTag = async (req, res) => {
  const { id } = req.params;
  const { nombre, postId } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }
  if (!nombre || !postId) {
    return res.status(400).json({ error: "Faltan datos requeridos"
  });
  }
  try {
    const tagExistente = await Tag.findById(id);
    if (!tagExistente) {
      return res.status(404).json({ error: "Tag no encontrado" });
    }
    const updatedTag = await Tag.findByIdAndUpdate(id, { nombre, postId }, { new: true });
    res.status(200).json(updatedTag);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el Tag", details:
  error.message });
  }
};
controller.updateTag = updateTag
const deleteById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }
  try {
    const tagExistente = await Tag.findById(id);
    if (!tagExistente) {
      return res.status(404).json({ error: "Tag no encontrado" });
    }
    const deletedTag = await Tag.findByIdAndDelete(id);
    if (!deletedTag) {
      return res.status(404).json({ error: "Tag no encontrado para eliminar" });
    }
    res.status(200).json({ message: "Tag eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el Tag", details: error.message });
  }
};
controller.deleteById = deleteById

const getPostsByTag = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }
  try {
    const tag = await Tag.findById(id).populate('postId', 'descripcion fecha pathImg userId');
    if (!tag) {
      return res.status(404).json({ error: "Tag no encontrado" });
    }
    if (tag.postId.length === 0) {
      return res.status(404).json({ message: "No se encontraron posts para este tag" });
    }
    res.status(200).json(tag.postId);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los posts del Tag", details: error.message });
  }
}
controller.getPostsByTag = getPostsByTag
module.exports = controller