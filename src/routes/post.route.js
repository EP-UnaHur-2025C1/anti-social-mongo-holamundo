const {Router} = require('express');
const Post = require('../Schemas/postSchema');
const schemaValidator = require('../Schemas/schemaValidator');
const genericMiddleware = require('../middleware/generic.middleware');
const postController = require('../controllers/post.controller');
const router = Router();

router.get("/posts", //Bien Post
    postController.getAllPost
)

router.post("/post",/// Bien Post
    schemaValidator(Post),
    postController.createPost
)

router.put("/post/:id",
    genericMiddleware.validateId(Post),
    postController.updatePost
)

router.get("/post/:id",/// Bien Post
    genericMiddleware.validateId(Post),
    postController.getPostById
)

router.delete("/post/:id",/// Bien Post
    genericMiddleware.validateId(Post),
    postController.deletePost
)

router.get("/post/:id/usuario",
    genericMiddleware.validateId(Post),
    postController.getUsersByPost
)

router.post("/post/:id/usuario",
    genericMiddleware.validateId(Post),
    postController.addUsersByPost
)



router.get("/post/:id/comentarios",
    genericMiddleware.validateId(Post),
    postController.getCommentsByPost
)

router.post("/post/:id/comentarios",
    genericMiddleware.validateId(Post),
    postController.addComments
)



module.exports = router
