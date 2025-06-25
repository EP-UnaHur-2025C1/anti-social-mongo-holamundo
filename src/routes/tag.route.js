const {Router} = require('express');
const Tag = require('../Schemas/tagSchema');
const schemaValidator = require('../Schemas/schemaValidator');
const genericMiddleware = require('../middleware/generic.middleware');
const tagController = require('../controllers/tags.controller');
const router = Router();


router.get("/tags", //Obtiene todas las Tag
    tagController.getTags
)

router.post("/tags", //Crear una nueva Tag
    schemaValidator(Tag),
    tagController.createTag
)

router.put("/tags/:id",//Actualizar un Tag por su ID
    genericMiddleware.validateId(Tag),
    tagController.updateTag
)

router.delete("/tags/:id",//Elimina un Tag por su ID
    genericMiddleware.validateId(Tag),
    tagController.deleteById
)

router.get("/tags/:id",//Obtiene los datos de un solo Tag por su ID
    genericMiddleware.validateId(Tag),
    tagController.getTagById
)

router.get("/tags/:id/posts",//Obtiene los Post que tiene asociado por el ID
    genericMiddleware.validateId(Tag),
    tagController.getPostsByTag
)

module.exports = router