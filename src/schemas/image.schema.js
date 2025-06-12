const Joi = require("joi");
const schema = Joi.object({
  urlImg: Joi.string().required().min(30).max(250).messages({
    "string.min": "url debe tener como mínimo {#limit} caracteres",
    "string.max": "url  debe tener como maximo {#limit} caractes",
    "string.empty": "url no puede ser vacia"
  }),
  postId: Joi.number().integer().required().messages({
    "number.base": "postId debe ser un número",
    "any.required": "postId es obligatorio"
  })

})
module.exports = schema;