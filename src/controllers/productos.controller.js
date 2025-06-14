const Producto = require("../Schemas/productosSchema")
const Fabricante = require("../Schemas/fabricanteSchema")
const controller = {}
const mongoose = require("../db/mongo.db").mongoose;

const getAllProductos = async (req,res) => {
    const productos = await Producto.find({});
    res.status(200).json(productos)
}

controller.getAllProductos = getAllProductos

const getProductoById = async (req,res) =>{
    const {id} = req.params
    const producto = await Producto.findById(id)
    res.status(200).json(producto)
}

controller.getProductoById = getProductoById

const createProducto = async (req,res) => {
    const producto = await Producto.create(req.body)
    res.status(201).json(producto)
}

controller.createProducto = createProducto

const updateProducto = async (req,res) =>{
    const {id} = req.params
    const producto = await Producto.findByIdAndUpdate(id, req.body, {new: true})
    res.status(200).json(producto)
}

controller.updateProducto = updateProducto

const deleteProducto = async (req,res) =>{
    const {id} = req.params
    try{
        const producto = await Producto.findByIdAndDelete(id)
        res.status(200).json({message: "Producto eliminado con éxito"})
    } catch (error){
        res.status(500).json({ error: "Error al eliminar el producto", details: error.message })
    }
    
}

controller.deleteProducto = deleteProducto

const getComponentesByProducto = async (req,res) => {
  const _id = new mongoose.Types.ObjectId(req.params.id)
  try{
    const producto = await Producto.aggregate([
      {
        $match: {_id}
      },
      {
        $project: {
          _id: 0,
          nombre: 1,
          descripcion: 1,
          precio: 1,
          componentes: 1,
        },
      },
    ])

    res.status(200).json(producto)

  }catch (err){
    res.status(500).json({ message: "Error al obtener componentes", error: err });
  }
}

controller.getComponentesByProducto = getComponentesByProducto

const addComponentes = async (req,res) =>{
  const {id} = req.params
  try {
    const producto = await Producto.findByIdAndUpdate(
      id,
      {$push : {componentes: req.body}},
      {new: true}
    );

    
    res.status(201).json(producto.componentes[producto.componentes.length - 1]);
  } catch (err) {
    res.status(400).json({ message: "Error al asociar componentes al producto", error: err });
  }

}

controller.addComponentes = addComponentes

const getFabricantesByProducto = async (req,res) => {
  const _id = new mongoose.Types.ObjectId(req.params.id)
  try{
    const producto = await Producto.aggregate([
      {
        $match: {_id}
      },
      {
        $lookup: {
          from: 'fabricantes',
          localField: "_id",
          foreignField: "productoId",
          as: "fabricantes"
        }
      },
      {
        $project: {
          _id: 1,
          nombre: 1,
          descripcion: 1,
          precio: 1,
          "fabricantes._id": 1,
          "fabricantes.nombre": 1,
          "fabricantes.direccion":1,
          "fabricantes.numeroContacto": 1,
        },
      },
    ])
    res.status(200).json(producto)

  }catch (err){
    res.status(500).json({ message: "Error al obtener fabricantes", error: err });
  }
}

controller.getFabricantesByProducto = getFabricantesByProducto

const addFabricantesByProducto = async (req,res) =>{

  try {
    const { id } = req.params;
    const { fabricanteIds } = req.body;
    const fabricantesExistentes = await Fabricante.find({ '_id': { $in: fabricanteIds } });
    if (fabricantesExistentes.length !== fabricanteIds.length) {
      return res.status(404).json({ message: "Uno o más fabricantes no existen" });
    }
    //Actualizar el producto con los fabricantes dados
    const updatedProducto = await Producto.findOneAndUpdate(
      { _id: id },  
      { $addToSet: { fabricanteId: { $each: fabricanteIds } } },  
      { new: true }  
    );
    //Agrego el producto al fabricante
    await Fabricante.updateMany(
      { '_id': { $in: fabricanteIds } },
      { $addToSet: { productoId: id } } 
    );

    res.status(201).json(updatedProducto);  
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

}

controller.addFabricantesByProducto = addFabricantesByProducto

module.exports = controller