const { Router } = require("express");
const router = Router();
const imageController= require("../controllers/images.controller");
const imageMiddleware= require("../middlewares/image.middleware");
const { Images} = require("../db/models/images");
const imageSchema = require("../schemas/image.schema");

router.get("/", imageController.getImages);

router.post(
  "/",
  imageMiddleware.schemaValidator(imageSchema),
  imageController.createImage
);
router.put('/:id', 
    imageMiddleware.validaId,
    imageController.updateImage,
    ) 
router.delete(
  "/:id",
  imageMiddleware.validaId,
  imageMiddleware.existsModelById(Images),
  imageController.deleteById
);

module.exports = router;
