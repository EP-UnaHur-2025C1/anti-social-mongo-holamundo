const {Router} = require('express');
const Post = require('../Schemas/postSchema');
const schemaValidator = require('../Schemas/schemaValidator');

const genericMiddleware = require('../middleware/generic.middleware');

const postController = require('../controllers/post.controller');
const router = Router();

router.get("/posts",
    postController.getAllPost
)

router.get("/post/:id",
    genericMiddleware.validateId(Post),
    postController.getPostById
)

router.post("/post",
    schemaValidator(Post),
    postController.createPost
)

router.put("/post/:id",
    genericMiddleware.validateId(Post),
    postController.updatePost
)

router.delete("/post/:id",
    genericMiddleware.validateId(Post),
    postController.deletePost
)

router.get("/post/:id/comentarios",
    genericMiddleware.validateId(Post),
    postController.getCommentsByPost
)

router.post("/post/:id/comentarios",
    genericMiddleware.validateId(Post),
    postController.addComments
)

router.get("/post/:id/usuario",
    genericMiddleware.validateId(Post),
    postController.getUsersByPost
)

router.post("/post/:id/usuario",
    genericMiddleware.validateId(Post),
    postController.addUsersByPost
)

module.exports = router
