const Image = require("../Schemas/imageSchema");
const mongoose = require("../db/mongo.db").mongoose;
const redisClient = require("../config/redisClient");
const controller = {};
const getAllImages = async (req, res) => {
  const cachedImages = await redisClient.get("images");
  if (cachedImages) {
    return res.status(200).json(JSON.parse(cachedImages));
  }else{
  const images = await Image.find().populate("postId");
  await redisClient.set("images", JSON.stringify(images), {
    EX: 3600, // Expira en 1 hora
    NX: true, // Solo establece si no existe
  });
  }
  res.json(images);
};
controller.getAllImages = getAllImages;

const getImagesByPost = async (req, res) => {
  const { id } = req.params;
  const cachedImages = await redisClient.get(`images:post:${id}`);
  if (cachedImages) {
    return res.status(200).json(JSON.parse(cachedImages));
  }else{
  const images = await Image.find({ postId: id });
  await redisClient.set(`images:post:${id}`, JSON.stringify(images), {
    EX: 3600, // Expira en 1 hora
    NX: true, // Solo establece si no existe
  });  
  return res.status(200).json(images);
  }
};
controller.getImagesByPost = getImagesByPost;

const createImage = async (req, res) => {
  const { urlImg, postId } = req.body;
  const image = new Image({ urlImg, postId });
  await image.save();
  await redisClient.del("images"); // Limpiar la caché de imágenes en Redis
  await redisClient.del(`images:post:${req.body.postId}`); // Limpiar la caché de imágenes por post en Redis
  res.status(201).json(image);
};
controller.createImage = createImage;

const updateImage = async (req, res) => {
  const { id } = req.params;
  const { urlImg, postId } = req.body;
  await redisClient.del("images"); // Limpiar la caché de imágenes en Redis
  await redisClient.del(`images:post:${postId}`); // Limpiar la caché de imágenes por post en Redis
  try {
    const updatedImage = await Image.findByIdAndUpdate(
      id,
      { urlImg, postId },
      { new: true, runValidators: true }
    );
    if (!updatedImage) {
      return res.status(404).json({ error: "Imagen no encontrada" });
    }
    res.json(updatedImage);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar la imagen" });
  }
};
controller.updateImage = updateImage;

const deleteImage = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedImage = await Image.findByIdAndDelete(id);
    if (!deletedImage) {
      return res.status(404).json({ error: "Imagen no encontrada" });
    }
    res.json({ mensaje: "Imagen eliminada correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar la imagen" });
  }
  await redisClient.del("images"); // Limpiar la caché de imágenes en Redis
  await redisClient.del(`images:post:${deletedImage.postId}`); // Limpiar
};
controller.deleteImage = deleteImage;

module.exports = controller;
