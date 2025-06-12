const Joi = require("joi");
const schema = Joi.object({
  nickName: Joi.string().required().min(8).max(30).messages({
    "any.required": "nickName es obligatorio",
    "string.min": "nickName debe tener como mínimo {#limit} caracteres",
    "string.max": "nickName debe tener como maximo {#limit} caractes",
    "string.empty": "nickName no puede ser vacio"
  }),
  email: Joi.string().required().email().min(11).max(255).messages({
    "any.required": "email es obligatorio",
    "string.min": "email debe tener como mínimo {#limit} caracteres",
    "string.max": "email debe tener como maximo {#limit} caractes",
    "string.empty": "email no puede ser vacio"
  }),
  password: Joi.string().required().min(8).max(16).messages({
    "any.required": "password es obligatorio",
    "string.min": "password debe tener como mínimo {#limit} caracteres",
    "string.max": "password debe tener como maximo {#limit} caractes",
    "string.empty": "password no puede ser vacio"
  }),
});

module.exports = schema;
