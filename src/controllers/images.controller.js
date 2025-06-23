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

module.exports = {
    getAllImages,
    getImagesByPost,
    createImage
};