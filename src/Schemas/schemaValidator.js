const schemaValidator =  (schema)=> {
    return (req, res, next) => {
        const validationError = new schema(req.body).validateSync();
        if (validationError) {
          const errores = Object.keys(validationError.errors).map((key) => {
            return {
              atributo: key,
              error: validationError.errors[key].message,
            };
          });
          return res.status(400).json({ errores });
        }
    
        next();
      };
}

module.exports = schemaValidator