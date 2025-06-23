const Image = require('../Schemas/imageSchema');

const getAllImages = async (req, res) => {
    const images = await Image.find().populate('postId');
    res.json(images)
};

const getImagesByPost = async (req, res) => {
    const {id} = req.params;
    const images = await Image.find({ postId: id});
    res.json(images)
}

const createImage = async (req, res) => {
    const {urlImg, postId} = req.body;

    const image = new Image({ urlImg, postId});
    await image.save();
    res.status(201).json(image)
};

const updateImage = async (req, res) => {
  const { id } = req.params;
  const { urlImg, postId } = req.body
  try {
    const updatedImage = await Image.findByIdAndUpdate(
      id,
      { urlImg, postId },
      { new: true, runValidators: true }
    );
    if (!updatedImage) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }
    res.json(updatedImage);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar la imagen' });
  }
};

const deleteImage = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedImage = await Image.findByIdAndDelete(id);
    if (!deletedImage) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }
    res.json({ mensaje: 'Imagen eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar la imagen' });
  }
};

module.exports = {
    getAllImages,
    getImagesByPost,
    createImage,
    updateImage,
    deleteImage
};