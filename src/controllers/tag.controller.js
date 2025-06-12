const { Tag } = require("../db/models");

const getTags = async (req, res) => {
  const data = await Tag.findAll({});
  res.status(200).json(data);
};
const getTagById = async (req, res) => {
  const data = await Tag.findByPk(req.params.id);
  res.status(200).json(data);
};

const createTag = async (req, res) => {
  try {
    const newComment = await Tag.create(req.body);
    res.status(201).json(newComment);
  } catch (e) {
    res.status(400).json({ error: e });
  }
};
const updateTag = async (req,res)=>{
  try {
    const {nombre} = req.body
    const id = req.params.id
    const tag = await Tag.findByPk(id);
    tag.nombre=nombre
    await tag.save()
    res.status(201).json(tag);
  } catch (e) {
    res.status(400).json({ error: e });
  }
}
const deleteById = async (req, res) => {
  const data = await Tag.findByPk(req.params.id);
  const removed = await data.destroy();
  res.status(200).json(removed);
};
module.exports = { getTags,getTagById,createTag,updateTag,deleteById};
