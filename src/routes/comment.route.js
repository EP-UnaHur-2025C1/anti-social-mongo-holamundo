const { Router } = require("express");
const router = Router();
const  commentController  = require("../controllers/comments.controller"); // Le quite la destructuración
const  commentMiddleware = require("../middlewares/comment.middleware"); // Le quite la destructuración
const { Comment } = require("../db/models/");
const commentSchema = require("../schemas/comment.schema");

router.get("/", commentController.getComments);

router.post(
  "/",
  commentMiddleware.schemaValidator(commentSchema),
  commentController.createComment
);
router.put('/:id', 
    commentMiddleware.validaId,
    commentController.updateComment,
    ) 
router.delete(
  "/:id",
  commentMiddleware.validaId,
  commentMiddleware.existsModelById(Comment),
  commentController.deleteById
);

module.exports = router;
