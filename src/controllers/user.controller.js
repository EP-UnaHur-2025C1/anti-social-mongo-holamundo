const { User } = require("../db/models");

const getUsers = async (req, res) => {
  const data = await User.findAll({});
  res.status(200).json(data);
};

const getUserById = async (req, res) => {
  const data = await User.findByPk(req.params.id);
  res.status(200).json(data);
};

const createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (e) {
    res.status(400).json({ error: e });
  }
};
const updateUser = async (req,res)=>{
  try {
    const {nickName,email,password} = req.body
    const id = req.params.id
    const user = await User.findByPk(id);
    user.nickName=nickName
    user.email=email
    user.password=password
    await user.save()
    res.status(201).json(user);
  } catch (e) {
    res.status(400).json({ error: e });
  }
}
const deleteById = async (req, res) => {
  const data = await User.findByPk(req.params.id);
  const removed = await data.destroy();
  res.status(200).json(removed);
};

module.exports = { getUsers, getUserById, createUser,updateUser, deleteById };
