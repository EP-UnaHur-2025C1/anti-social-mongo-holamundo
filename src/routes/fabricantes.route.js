const {Router} = require('express');
const Fabricante = require('../Schemas/fabricanteSchema');
const schemaValidator = require('../Schemas/schemaValidator');

const genericMiddleware = require('../middleware/generic.middleware');

const fabricantesController = require('../controllers/fabricantes.controller');

const route = Router();

route.get('/fabricantes', 
    fabricantesController.getAllFabricantes
)

route.get('/fabricantes/:id', 
    genericMiddleware.validateId(Fabricante),
    fabricantesController.getFabricanteById
    )

route.post('/fabricantes', 
    schemaValidator(Fabricante),
    fabricantesController.createFabricante
)

route.put('/fabricantes/:id', 
    genericMiddleware.validateId(Fabricante),
    fabricantesController.updateFabricante
    ) 
    
route.delete('/fabricantes/:id',
    genericMiddleware.validateId(Fabricante),
    fabricantesController.deleteFabricante
    ) 

route.get('/fabricantes/:id/productos', 
    genericMiddleware.validateId(Fabricante),
    fabricantesController.getProductosByFabricante
)

module.exports = route