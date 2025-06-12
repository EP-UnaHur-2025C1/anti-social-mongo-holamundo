const Joi = require("joi");
const schema = Joi.object({
  postId: Joi.string().required().min(1).max(4).messages({
    "any.required": "postId es obligatorio",
    "string.min": "postId debe tener como mínimo {#limit} caracteres",
    "string.max": "postId  debe tener como maximo {#limit} caractes",
    "string.empty": "postId no puede ser vacia"
  }),
  tagId: Joi.string().required().min(1).max(4).messages({
    "any.required": "tagId es obligatorio",
    "string.min": "tagId debe tener como mínimo {#limit} caracteres",
    "string.max": "tagId  debe tener como maximo {#limit} caractes",
    "string.empty": "tagId no puede ser vacia"
  })
})
module.exports = schema;