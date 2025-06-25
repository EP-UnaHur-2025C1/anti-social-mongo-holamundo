const mongoose = require('mongoose');
const middleware = {}


const validateId = (Model, paramName = 'id') => async (req, res, next) => {
  const id = req.params[paramName];
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: `El ID '${id}' no es válido.` });
  }

  const exists = await Model.findById(id);
  if (!exists) {
    return res.status(404).json({ error: `No se encontró el recurso con ID '${id}'.` });
  }

  next();
};
middleware.validateId = validateId

module.exports = middleware