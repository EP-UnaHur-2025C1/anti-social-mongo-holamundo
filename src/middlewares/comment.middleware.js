const existsModelById = (modelo) => {
  return async (req, res, next) => {
    const id = req.params.id;
    console.log('MODELO: ', modelo);
    console.log('ID: ', id);
    const data = await modelo.findByPk(id);
    if (!data) {
      return res
        .status(404)
        .json({ message: `El id ${id} no se encuentra registrado` });
    }
    next();
  };
};

const validaId = (req, res, next) => {
  const id = req.params.id;
  if (id <= 0) {
    return res
      .status(400)
      .json({ message: "Bad Request: No pueden ser un id negativo" });
  }
  next();
};

const schemaValidator = (schema) => {
  return (req, res, next) => {
    console.log("BODY: ", req.body); //funciona
    console.log("PARAMS: ", req.params); //es null
    const { error, _ } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      console.log("ERROR: ", error); //funciona
      const errores = error.details.map((e) => {
        return { atribulo: e.path[0], mensaje: e.message, tipoError: e.type };
      });
      return res.status(400).json({ errores });
    }
    next();
  };
};

//module.exports = { logRequest, existsModelById, validaId, schemaValidator };
module.exports = { existsModelById, validaId, schemaValidator };
