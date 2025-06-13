const existsModelById = (modelo) => {
  return async (req, res, next) => {
    const { urlImg } = req.params;
    const data = await modelo.findByPk(urlImg);
    if (!data) {
      return res
        .status(404)
        .json({ message: `El urlImg ${urlImg} no se encuentra registrado` });
    }
    next();
  };
};

const validaUrlImg  = (req, res, next) => {
  const { urlImg } = req.params;
  if (!urlImg || typeof urlImg !== "string") {
    return res.status(400).json({ message: "Bad Request: urlImg inválido" });
  }
  next();
};

const schemaValidator = (schema) => {
  return (req, res, next) => {
    const { error, _ } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errores = error.details.map((e) => {
        return { atribulo: e.path[0], mensaje: e.message, tipoError: e.type };
      });
      return res.status(400).json({ errores });
    }
    next();
  };
};

//module.exports = { logRequest, existsModelById, validaId, schemaValidator };
module.exports = { existsModelById, validaUrlImg, schemaValidator };
