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
    const {urlImg} = req.body
    const id = req.params.id
    const image = await Post.findByPk(id);
    image.urlImg=urlImg
    await image.save()
    res.status(201).json(image);
  } catch (e) {
    res.status(400).json({ error: e });
  }
}
const deleteById = async (req, res) => {
  const data = await Images.findByPk(req.params.id);
  const removed = await data.destroy();
  res.status(200).json(removed);
};
module.exports = { getImages,getImageById,createImage,updateImage,deleteById};
