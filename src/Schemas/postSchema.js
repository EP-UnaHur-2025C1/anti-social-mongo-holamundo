//const { mongoose } = require('../db/mongo.db')
const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const postSchema = new mongoose.Schema({
  
  descripcion: {
    type: Schema.Types.String,
    required: [true, 'La descripción es obligatoria'],
  },
  fecha: {
    type: Schema.Types.Number,
    required: [true, 'La fecha es obligatoria'],
    default: Date.now,
  },
  pathImg: {
    type: Schema.Types.String,
    required: [true, 'La imagen es obligatoria'],
  },
  userId: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Usuario' // Relación con el modelo Usuario,
  }],
  comentarios: [{ // Relación incrustada con los comentarios
    
    descripcion: {
      type: String,
      required: [true, 'La descripción del comentario es obligatoria']
    },
    fecha: {
      type: Date,
      required: [true, 'La fecha del comentario es obligatoria'],
      default: Date.now,
    },
    visible: {
      type: Boolean,
      default: true, // Por defecto, los comentarios son visibles
    },
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Usuario', // Relación con el modelo Usuario
      required: [true, 'El ID del usuario es obligatorio']
    }

  }],
},
{
  collection: "posts",
}
)

postSchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret.__v;
    delete ret._id;
  }
})

const Post = mongoose.model("Post", postSchema);
module.exports = Post;