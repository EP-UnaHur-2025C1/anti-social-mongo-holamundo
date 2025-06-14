const mongoose = require('mongoose');
const middleware = {}


const validateId = (Model) => async(req, res, next) => {
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: `El ID '${id}' no es válido. `})
    }

    const  exists = await Model.findById(id)
    if (!exists){
        return res.status(404).json({error: `No se encontró el producto con Id ${id} en la base de datos.`})
    } 

    next();
}
middleware.validateId = validateId

module.exports = middleware