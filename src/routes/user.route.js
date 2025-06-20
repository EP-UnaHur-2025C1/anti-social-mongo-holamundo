const { Router } = require("express");
const router = Router();
const userController = require("../controllers/user.controller"); // Le quite la destructuración
const userMiddleware = require("../middlewares/user.middleware"); // Le quite la destructuración
const { User } = require("../db/models");
const UserSchema = require("../schemas/user.schema");

router.get("/", userController.getUsers);
router.get(
  "/:id",
  userMiddleware.validaId,
  userMiddleware.existsModelById(User),
  userController.getUserById
);

router.post(
  "/",
  userMiddleware.schemaValidator(UserSchema),
  userController.createUser
);

router.put("/:id", 
  userMiddleware.validaId,
  userController.updateUser
);

router.delete(
  "/:id",
  userMiddleware.validaId,
  userMiddleware.existsModelById(User),
  userController.deleteById
);
//Follow
router.post("/:id/follow",
  userMiddleware.validaId,
  userController.followUser
);

router.delete("/:id/unfollow",
  userMiddleware.validaId,
  userController.unfollowUser
);

router.get("/:id/followers",
  userMiddleware.validaId,
  userController.getFollowers
);
router.get("/:id/following",
  userMiddleware.validaId,
  userController.getFollowing
);
module.exports = router;
