const {Router} = require('express');
const Tag = require('../Schemas/tagSchema');
const schemaValidator = require('../Schemas/schemaValidator');
const genericMiddleware = require('../middleware/generic.middleware');
const tagController = require('../controllers/tags.controller');
const router = Router();


router.get("/tags", //Bien Tag
    tagController.getTags
)

router.post("/tag", //Bien en el Tag
    schemaValidator(Tag),
    tagController.createTag
)

router.put("/tag/:id",//Bien en el Tag
    genericMiddleware.validateId(Tag),
    tagController.updateTag
)

router.delete("/tag/:id",//Bien Tag
    genericMiddleware.validateId(Tag),
    tagController.deleteById
)

router.get("/tag/:id",
    genericMiddleware.validateId(Tag),
    tagController.getTagById
)

router.get("/tag/:id/posts",
    genericMiddleware.validateId(Tag),
    tagController.getPostsByTag
)

module.exports = router