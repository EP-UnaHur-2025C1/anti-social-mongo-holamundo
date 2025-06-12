const genericMiddleware = require("./generic.middleware");
const commentMiddleware= require("./comment.middleware");
const userMiddleware = require("./user.middleware")
const postMiddleware = require("./post.middleware")
const imageMiddleware = require("./image.middleware")

module.exports = { genericMiddleware,commentMiddleware,userMiddleware,postMiddleware,imageMiddleware};
