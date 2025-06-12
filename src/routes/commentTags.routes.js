const { Router } = require("express");
const router = Router();
const { postController } = require("../controllers/post.controller");
const { postMiddleware } = require("../middlewares/post.middleware");
const { Post} = require("../db/models/post");
const commentTagSchema = require("../schemas/commentTag.schema");
router.post(
  "/comment-tags",
  postMiddleware.schemaValidator(commentTagSchema),
  postController.agregarTag
);
router.delete(
  "/comment-tags",
  postMiddleware.validaId,
  postMiddleware.existsModelById(Coments),
  postController.deleteTag
);
router.get("/comment-tags/post/:postId", 
    postController.getTags
);
module.exports=router;