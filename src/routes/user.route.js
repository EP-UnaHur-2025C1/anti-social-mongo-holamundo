const {Router} = require('express');
const Usuario = require('../Schemas/userSchema');
const Post = require('../Schemas/postSchema');
const schemaValidator = require('../Schemas/schemaValidator');

const genericMiddleware = require('../middleware/generic.middleware');

const userController = require('../controllers/user.controller');

const router = Router();


router.get("/usuarios",// Obtiene todos los usuarios
    userController.getUsers
)

router.get("/usuarios/:id",//Obtiene un Usuario por el ID
    genericMiddleware.validateId(Usuario),
    userController.getUserById
)

router.post("/usuarios",//Crea un nuevo Usuario
    schemaValidator(Usuario),
    userController.createUser
)

router.put("/usuarios/:id",//Actualiza un Usuario por el ID
    genericMiddleware.validateId(Usuario),
    userController.updateUser
)

router.delete("/usuarios/:id",//Elimina el Usuario por el ID
    genericMiddleware.validateId(Usuario),
    userController.deleteById
)

router.get("/usuarios/:id/posts",//Obtiene todos los Post por el ID del Usuario
    genericMiddleware.validateId(Usuario),
    userController.getPostsByUser
)

router.post("/usuarios/:id/posts",// Actualiza y asocia un nuevo Post por el ID del Usuario
    genericMiddleware.validateId(Usuario),
    userController.addPost
)

router.get("/usuarios/:id/comentarios",//Obtiene los comentarios por el ID del Usuario
    genericMiddleware.validateId(Usuario),
    userController.getCommentsByUser
)
router.post("/usuarios/:id/comentarios",//Agrega un conmentario por el ID del Usuario
    genericMiddleware.validateId(Usuario),
    userController.addCommentsByUser
)

router.post("/usuarios/:id/seguidos",//El Usuario actual sigue al Usuario con el ID
    genericMiddleware.validateId(Usuario),
    userController.followUser
)

router.delete("/usuarios/:id/seguidos",///El Usuario actual deja de seguir al Usuario con ID
    genericMiddleware.validateId(Usuario),//Seguidoss
    userController.unfollowUser
)

router.get("/usuarios/:id/seguidores",//Obtiene todos los Usuarios que siguen a este ID
    genericMiddleware.validateId(Usuario),
    userController.getFollowers
)

router.get("/usuarios/:id/seguidos", /// Obtiene todos los Usuarios que este usuarios esta siguiendo
    genericMiddleware.validateId(Usuario),////////////seguidosa
    userController.getFollowing
)



module.exports = router