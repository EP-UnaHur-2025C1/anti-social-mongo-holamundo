const Joi = require("joi");
const schema = Joi.object({
  descripcion: Joi.string().required().min(1).max(250).messages({
    "any.required": "descripcion es obligatorio",
    "string.min": "descripcion debe tener como mínimo {#limit} caracteres",
    "string.max": "descripcion debe tener como maximo {#limit} caractes",
    "string.empty": "descripcion no puede ser vacio"
  }),
  nickName: Joi.string().required().messages({
    "any.required": "nickName es obligatorio",
    "string.empty": "nickName no puede ser vacio"
  }), 
});

module.exports = schema;
