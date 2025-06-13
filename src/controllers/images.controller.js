const { Images } = require("../db/models");

const getImages = async (req, res) => {
  const data = await Images.findAll({});
  res.status(200).json(data);
};
const getImageById = async (req, res) => {
  const data = await Images.findByPk(req.params.id);
  res.status(200).json(data);
};

const createImage = async (req, res) => {
  try {
    const newImage = await Images.create(req.body);
    res.status(201).json(newImage);
  } catch (e) {
    res.status(400).json({ error: e });
  }
};
const updateImage = async (req,res)=>{
  try {
    const { urlImg } = req.params;
    const { postId } = req.body;

    const image = await Images.findByPk(urlImg);
    if (!image) {
    return res.status(404).json({ error: "Imagen no encontrada" });
    }
    image.urlImg=urlImg

    await image.save()
    res.status(200).json(image);
  } catch (e) {
    res.status(400).json({ error: e });
  }
}
const deleteById = async (req, res) => {
  try{
    const {urlImg} = req.params;
    const data = await Images.findByPk(urlImg);
    if(!data){
      return res.status(404).json({error: `La imagen ${urlImg} no se encuentra registrada` });
    }
  await image.destroy();
  res.status(200).json({ message: "Archivo eliminado correctamente" });
  } catch (e) {
    res.status(500).json({error: e});
  }
}

module.exports = { getImages,getImageById,createImage,updateImage,deleteById};
