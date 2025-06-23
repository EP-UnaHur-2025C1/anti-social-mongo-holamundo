const { Router } = require('express');
const router = Router();
const imageController = require('../controllers/images.controller');
const schemaValidator = require('../Schemas/schemaValidator');
const Image = require('../Schemas/imageSchema')

router.get('/imagenes', imageController.getAllImages);
router.get('/imagenes/post/:id', imageController.getImagesByPost);
router.post('/imagenes', imageController.createImage);

module.exports = router;