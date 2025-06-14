const {Router} = require('express');
const Usuario = require('../Schemas/userSchema');
const Post = require('../Schemas/postSchema');
const schemaValidator = require('../Schemas/schemaValidator');

const genericMiddleware = require('../middleware/generic.middleware');

const userController = require('../controllers/user.controller');

const router = Router();


router.get("/usuarios",
    userController.getUsers
)

router.get("/usuario/:id",
    genericMiddleware.validateId(Usuario),
    userController.getUserById
)

router.post("/usuario",
    schemaValidator(Usuario),
    userController.createUser
)

router.put("/usuario/:id",
    genericMiddleware.validateId(Usuario),
    userController.updateUser
)

router.delete("/usuario/:id",
    genericMiddleware.validateId(Usuario),
    userController.deleteById
)

router.get("/usuario/:id/posts",
    genericMiddleware.validateId(Usuario),
    userController.getPostsByUser
)

router.post("/usuario/:id/posts",
    genericMiddleware.validateId(Usuario),
    userController.addPost
)

router.get("/usuario/:id/comentarios",
    genericMiddleware.validateId(Usuario),
    userController.getCommentsByUser
)

module.exports = router