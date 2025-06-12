const { Router } = require("express");
const router = Router();
const tagController = require("../controllers/tag.controller");
const tagMiddleware = require("../middlewares/tag.middleware");
const {Tag} = require("../db/models");
const tagSchema = require("../schemas/tag.schema");

router.get("/", tagController.getTags);

router.post(
  "/",
  tagMiddleware.schemaValidator(tagSchema),
  tagController.createTag
);
router.put('/:id', 
    tagMiddleware.validaId,
    tagMiddleware.schemaValidator(tagSchema),
    tagController.updateTag,
    ) 
router.delete(
  "/:id",
  tagMiddleware.validaId,
  tagMiddleware.existsModelById(Tag),
  tagController.deleteById
);

module.exports = router;
