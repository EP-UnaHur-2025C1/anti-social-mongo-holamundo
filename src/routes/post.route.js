const {Router} = require('express');
const Post = require('../Schemas/postSchema');
const schemaValidator = require('../Schemas/schemaValidator');
const genericMiddleware = require('../middleware/generic.middleware');
const postController = require('../controllers/post.controller');
const router = Router();

router.get("/posts", // Obtiene todos los Post
    postController.getAllPost
)

router.post("/post",//Crea un nuevo Post
    schemaValidator(Post),
    postController.createPost
)

router.put("/post/:id",//Actualiza un Post por el ID
    genericMiddleware.validateId(Post),
    postController.updatePost
)

router.get("/post/:id",//Obtiene y devuelve un Post específico por el ID
    genericMiddleware.validateId(Post),
    postController.getPostById
)

router.delete("/post/:id",//Elimina el Post por el ID
    genericMiddleware.validateId(Post),
    postController.deletePost
)

router.get("/post/:id/usuario",// Obtiene los usuarios asociados al Post
    genericMiddleware.validateId(Post),
    postController.getUsersByPost
)

router.post("/post/:id/usuario",//Asocia un usuario a un Post
    genericMiddleware.validateId(Post),
    postController.addUsersByPost
)

router.get("/post/:id/comentarios",//Obtiene los comentarios del Post
    genericMiddleware.validateId(Post),
    postController.getCommentsByPost
)

router.post("/post/:id/comentarios",//Agrega un comentario al Post
    genericMiddleware.validateId(Post),
    postController.addComments
)



module.exports = router
