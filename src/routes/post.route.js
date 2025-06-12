const { Router } = require("express");
const router = Router();
const  postController  = require("../controllers/post.controller");
const  postMiddleware  = require("../middlewares/post.middleware");
const { Post } = require("../db/models");
const { postImages} = require("../db/models/images");
const postSchema = require("../schemas/post.schema");

router.get("/", postController.getPosts)
router.get(
  "/:id",
  postMiddleware.validaId,
  postMiddleware.existsModelById(Post),
  postController.getPostById
);

router.post(
  "/",
  postMiddleware.schemaValidator(postSchema),
  postController.createPost
)
router.put('/:id', 
    postMiddleware.validaId,
    postController.updatePost,
    ) 
router.delete(
  '/:id',
  postMiddleware.validaId,
  postMiddleware.existsModelById(Post),
  postController.deleteById
)
router.delete(
  '/:id/images/:imgId',
  postMiddleware.validaId,
  postMiddleware.existsModelById(Post),
  postMiddleware.validaIdImg,
  postMiddleware.existsModelByIdImg(postImages),
  postController.deletePostImageById
)
router.put('/:id/images/:imgId', 
    postMiddleware.validaId,
    postMiddleware.validaIdImg,
    postController.updatePostImage,
    ) 

module.exports = router;
