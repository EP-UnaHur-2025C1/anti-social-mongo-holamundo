//const { mongoose } = require('../db/mongo.db')
const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: {
    type: Schema.Types.String,
    required: [true, 'El nombre es obligatorio'],
  },
  descripcion: {
    type: Schema.Types.String,
    required: [true, 'La descripción es obligatoria'],
  },
  precio: {
    type: Schema.Types.Number,
    required: [true, 'El precio es obligatorio'],
  },
  pathImg: {
    type: Schema.Types.String
  },
  fabricanteId: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Fabricante' ,
  }],
  componentes: [{ // Relación incrustada con los componentes
    nombre: {
      type: String,
      required: [true, 'El nombre del componente es obligatorio']
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción del componente es obligatoria']
    }
  }],
},
{
  collection: "productos",
}
)

productoSchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret.__v;
    delete ret._id;
  }
})

const Producto = mongoose.model("Producto", productoSchema);
module.exports = Producto;