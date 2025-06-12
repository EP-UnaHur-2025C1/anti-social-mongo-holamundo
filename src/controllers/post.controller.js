const { Post } = require("../db/models/");

const getPosts = async (req, res) => {
  const data = await Post.findAll({});
  res.status(200).json(data);
};
const getPostById = async (req, res) => {
  const data = await Post.findByPk(req.params.id);
  res.status(200).json(data);
};

const createPost = async (req, res) => {
  try {
    const newPost = await Post.create(req.body);
    res.status(201).json(newPost);
  } catch (e) {
    res.status(400).json({ error: e });
  }
};
const updatePost = async (req,res)=>{
  try {
    const {descripcion} = req.body
    const id = req.params.id
    const post = await Post.findByPk(id);
    post.descripcion=descripcion
    await post.save()
    res.status(201).json(post);
  } catch (e) {
    res.status(400).json({ error: e });
  }
}

const deleteById = async (req, res) => {
  console.log("DATA ON DELETE: ", req.params.id);
  const data = await Post.findByPk(req.params.id);
  const removed = await data.destroy();
  res.status(200).json(removed);
};

const updatePostImage = async (res,req)=>{
    try {
    const body = req.body
    const id = req.params.id
    const post = await Post.findByPk(id);
    post.addImages(body)
    await post.save()
    res.status(201).json(post);
  } catch (e) {
    res.status(400).json({ error: e });
  }
}
const deletePostImageById=async(res,req)=>{
  try {
    const id = req.params.id
    const idImg = req.params.idImg
    const post = await Post.findByPk(id);
    post.removeImage(idImg)
    await post.save()
    res.status(201).json(post);
  } catch (e) {
    res.status(400).json({ error: e });
  }
}
const agregarTag = async(req,res)=>{
  try {
    const {postId,tagId} = req.body
    const post = await Post.findByPk(postId);
    post.addTag(tagId)
    await post.save()
    res.status(201).json(post);
  } catch (e) {
    res.status(400).json({ error: e });
  }
}
const deleteTag = async (req,res)=>{
  try {
    const {postId,tagId} = req.body
    const post = await Post.findByPk(postId);
    post.removeTag(tagId)
    await post.save()
    res.status(201).json(post);
  } catch (e) {
    res.status(400).json({ error: e });
  }
}
const getTags = async (req,res)=>{
  try {
    const postId = req.params.idImg
    const post = await Post.findByPk(postId);
    post.getTags(tagId)
    res.status(201).json(post);
  } catch (e) {
    res.status(400).json({ error: e });
  }
}
module.exports = { getPosts,getPostById,createPost,updatePost,
  updatePostImage,deleteById,deletePostImageById,agregarTag,deleteTag,getTags};
