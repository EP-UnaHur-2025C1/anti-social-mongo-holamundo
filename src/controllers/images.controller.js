const Images = require("../Schemas/imageSchema");
const mongoose = require("../db/mongo.db").mongoose;
const redisClient = require("../config/redisClient");
const controller = {};


const getAllImages = async (req, res) => {
  let images;
  const cachedImages = await redisClient.get("images");

  if (cachedImages) {
    return res.status(200).json(JSON.parse(cachedImages));
  } else {
    images = await Images.find().populate("postId");
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
  const images = await Images.find({ postId: id });
  await redisClient.set(`images:post:${id}`, JSON.stringify(images), {
    EX: 3600, // Expira en 1 hora
    NX: true, // Solo establece si no existe
  });  
  return res.status(200).json(images);
  }
};
controller.getImagesByPost = getImagesByPost;

const createImage = async (req, res) => {
  try {
    console.log("Creando imagen con datos:", req.body);
    const { urlImg, postId } = req.body; // ← MOVER ESTO ARRIBA
    if (!urlImg || !postId) {
      return res.status(400).json({ error: "urlImg y postId son requeridos" });
    }

    const exists = await Images.findOne({ urlImg, postId });
    if (exists) {
      return res.status(409).json({ error: "La imagen ya existe para este post" });
    }

    const image = new Images({ urlImg, postId });
    await image.save();
    await redisClient.del("images");
    await redisClient.del(`images:post:${postId}`);

    return res.status(201).json(image);
  } catch (err) {
    return res.status(500).json({ error: "Error al crear la imagen", details: err.message });
  }
};
controller.createImage = createImage;

const updateImage = async (req, res) => {
  const { id } = req.params;
  const { urlImg, postId } = req.body;
  await redisClient.del("images"); // Limpiar la caché de imágenes en Redis
  await redisClient.del(`images:post:${postId}`); // Limpiar la caché de imágenes por post en Redis
  try {
    const updatedImage = await Images.findByIdAndUpdate(
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
  try {
    console.log("Eliminando imagen con ID:", req.params.id);
    const { id } = req.params;
    const deletedImage = await Images.findByIdAndDelete(id);

    if (!deletedImage) {
      return res.status(404).json({ error: "Imagen no encontrada" });
    }

    // Limpiar caché
    await redisClient.del("images");
    await redisClient.del(`images:post:${deletedImage.postId}`);

    return res.status(200).json({ message: "Archivo eliminado correctamente" });
  } catch (err) {
    return res.status(500).json({
      message: "Error al eliminar la imagen",
      error: err.message,
    });
  }
};
controller.deleteImage = deleteImage;

module.exports = controller;
