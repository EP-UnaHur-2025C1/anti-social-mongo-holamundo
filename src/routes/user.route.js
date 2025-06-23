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

router.get("/usuarios/:id",
    genericMiddleware.validateId(Usuario),
    userController.getUserById
)

router.post("/usuarios",
    schemaValidator(Usuario),
    userController.createUser
)

router.put("/usuarios/:id",
    genericMiddleware.validateId(Usuario),
    userController.updateUser
)

router.delete("/usuarios/:id",
    genericMiddleware.validateId(Usuario),
    userController.deleteById
)

router.get("/usuarios/:id/posts",
    genericMiddleware.validateId(Usuario),
    userController.getPostsByUser
)

router.post("/usuarios/:id/posts",
    genericMiddleware.validateId(Usuario),
    userController.addPost
)

router.get("/usuarios/:id/comentarios",
    genericMiddleware.validateId(Usuario),
    userController.getCommentsByUser
)
router.post("/usuarios/:id/comentarios",
    genericMiddleware.validateId(Usuario),
    userController.addCommentsByUser
)

router.post("/usuarios/:id/seguidos",
    genericMiddleware.validateId(Usuario),
    userController.followUser
)

router.delete("/usuarios/:id/seguidos",////////////////////seguidoss
    genericMiddleware.validateId(Usuario),
    userController.unfollowUser
)

router.get("/usuario/:id/seguidores",
    genericMiddleware.validateId(Usuario),
    userController.getFollowers
)

router.get("/usuarios/:id/seguidos", //////////////////////////seguidosa
    genericMiddleware.validateId(Usuario),
    userController.getFollowing
)



module.exports = router