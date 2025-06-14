const {Router} = require('express');
const Producto = require('../Schemas/productosSchema');
const schemaValidator = require('../Schemas/schemaValidator');

const genericMiddleware = require('../middleware/generic.middleware');

const productosController = require('../controllers/productos.controller');
const route = Router();

route.get("/productos",
    productosController.getAllProductos
)

route.get("/productos/:id",
    genericMiddleware.validateId(Producto),
    productosController.getProductoById
)

route.post("/productos",
    schemaValidator(Producto),
    productosController.createProducto
)

route.put("/productos/:id",
    genericMiddleware.validateId(Producto),
    productosController.updateProducto
)

route.delete("/productos/:id",
    genericMiddleware.validateId(Producto),
    productosController.deleteProducto
)

route.get("/productos/:id/componentes",
    genericMiddleware.validateId(Producto),
    productosController.getComponentesByProducto
)

route.post("/productos/:id/componentes",
    genericMiddleware.validateId(Producto),
    productosController.addComponentes
)

route.get("/productos/:id/fabricantes",
    genericMiddleware.validateId(Producto),
    productosController.getFabricantesByProducto
)

route.post("/productos/:id/fabricantes",
    genericMiddleware.validateId(Producto),
    productosController.addFabricantesByProducto
)

module.exports = route
