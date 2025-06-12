const { Comment } = require("../db/models/");

const getComments = async (req, res) => {
  const data = await Comment.findAll({});
  res.status(200).json(data);
};
const getCommentById = async (req, res) => {
  const data = await Comment.findByPk(req.params.id);
  res.status(200).json(data);
};

const createComment = async (req, res) => {
  try {
    console.log("HOLAAAAAAAAAAAAAAAAAAA A A A A A A A AA ");
    const newComment = await Comment.create(req.body);
    console.log("NEW COMMENT: ", newComment);
    console.log("REQ BODY: ", req.body);
    console.log("REQ PARAMS: ", req.params);
    res.status(201).json(newComment);
  } catch (e) {
    res.status(400).json({ error: e });
  }
};
const updateComment = async (req,res)=>{
  try {
    const {nickName, postId, descripcion, comentario} = req.body
    const id = req.params.id
    const comment = await Comment.findByPk(id); //aca rompe, los siguientes console.log no se ejecutan
    comment.nickName=nickName
    comment.postId=postId
    comment.descripcion=descripcion
    comment.comentario=comentario
    await comment.save()
    res.status(201).json(comment);
  } catch (e) {
    res.status(400).json({ error: e });
  }
}
const deleteById = async (req, res) => {
  const data = await Comment.findByPk(req.params.id);
  const removed = await data.destroy();
  res.status(200).json(removed);
};
module.exports = { getComments,getCommentById,createComment,updateComment,deleteById};
