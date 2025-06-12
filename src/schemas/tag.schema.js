const Joi = require("joi");
const schema = Joi.object({
  nombre: Joi.string().required().min(2).max(50).messages({
    "any.required": "nombre es obligatorio",
    "string.min": "nombre debe tener como mínimo {#limit} caracteres",
    "string.max": "nombre debe tener como maximo {#limit} caractes",
    "string.empty": "nombre no puede ser vacio"
  }),
});

module.exports = schema;
