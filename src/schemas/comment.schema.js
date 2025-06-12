const Joi = require("joi");

const schema = Joi.object({
  commentId: Joi.number().integer().min(1),
  nickName: Joi.string().required().messages({
    "any.required": "nickName es obligatorio",
    "string.empty": "nickName no puede ser vacio"
  }),
  descripcion: Joi.string().required().messages({
    "any.required": "descripcion es obligatorio",
    "string.empty": "descripcion no puede ser vacio"
  }),
  postId : Joi.number().integer().min(1).required().messages({
    "any.required": "postId es obligatorio",
    "number.base": "postId debe ser un número",
    "number.min": "postId debe ser mayor que 0"
  }),
  comentario: Joi.string().required().messages({
    "any.required": "comentario es obligatorio",
    "string.empty": "comentario no puede ser vacio"
  }),
});

module.exports = schema;
