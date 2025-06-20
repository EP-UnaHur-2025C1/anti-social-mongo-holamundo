const { where } = require("sequelize");
const { User, Follow } = require("../db/models");

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
// Follow

const followUser = async (req, res) => {
  const seguidoId = parseInt(req.params.id);
  const seguidorId = parseInt(req.body.seguidorId);

  if (seguidoId === seguidorId) {
    return res.status(400).json({ error: "No puedes seguirte a ti mismo" });
  }

  try { 
    const [follow, created] = await Follow.findOrCreate({
      where: { seguidorId, seguidoId },
    });

    if (!created) {
    return res.status(409).json({ error: "Ya sigues a este usuario" });
    }

    res.status(201).json({ message: "Ahora estas siguiendo a otro usuario" });

  }catch(e) {
    res.status(500).json({ error: e.message });
  }
  };

const unfollowUser = async (req, res) => {
  const seguidoId = parseInt(req.params.id);
  const seguidorId = parseInt(req.body.seguidorId);

  try {
    const deleted = await Follow.destroy({ where: { seguidorId, seguidoId } });

    if(!deleted){
      return res.status(404).json({ error: "No estabas siguiendo a este usuario" });
    }

    res.status(204).send();
  }catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const getFollowers = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const user= await User.findByPk(id);
    const seguidores= await user.getSeguidores();
    res.status(200).json(seguidores);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


const getFollowing = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const user = await User.findByPk(id);
    const seguidos = await user.getSeguidos();
    res.status(200).json(seguidos);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};



module.exports = { getUsers, getUserById, createUser,updateUser, deleteById
                  , followUser, unfollowUser, getFollowers, getFollowing
};
