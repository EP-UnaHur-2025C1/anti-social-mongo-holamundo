const { Router } = require("express");
const router = Router();
const imageController= require("../controllers/images.controller");
const imageMiddleware= require("../middlewares/image.middleware");
const { Images} = require("../db/models");
const imageSchema = require("../schemas/image.schema");

router.get("/", imageController.getImages);

router.post(
  "/",
  imageMiddleware.schemaValidator(imageSchema),
  imageController.createImage
);
router.put('/:urlImg', 
    imageMiddleware.validaUrlImg,
    imageController.updateImage
    ) 
router.delete(
  "/:urlImg", 
  imageMiddleware.validaUrlImg,
  imageMiddleware.existsModelById(Images),
  imageController.deleteById
);

module.exports = router;
