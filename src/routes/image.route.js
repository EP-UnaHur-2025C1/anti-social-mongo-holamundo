const { Router } = require('express');
const router = Router();
const imageController = require('../controllers/images.controller');
const schemaValidator = require('../Schemas/schemaValidator');
const Image = require('../Schemas/imageSchema')

// Obtener todas las imagenes
router.get('/imagenes', imageController.getAllImages);
//Obtiene las imagenes asociadas a un Post por su ID
router.get('/imagenes/post/:id', imageController.getImagesByPost);
// Crea una nueva imagen
router.post('/imagenes', imageController.createImage);
// Actualiza la imagen con el ID
router.put('/imagenes/:id', imageController.updateImage);
// Elimina la imagen con el ID
router.delete('/imagenes/:id', imageController.deleteImage) 

module.exports = router;