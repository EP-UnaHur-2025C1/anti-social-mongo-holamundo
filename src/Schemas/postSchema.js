//const { mongoose } = require('../db/mongo.db')
const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const postSchema = new mongoose.Schema({
  
  descripcion: {
    type: Schema.Types.String,
    required: [true, 'La descripción es obligatoria'],
  },
  fecha: {
    type: Schema.Types.Date,
    required: [true, 'La fecha es obligatoria'],
    default: Date.now,
  },
  pathImg: {
    type: Schema.Types.String,
    required: [true, 'La imagen es obligatoria'],
  },
  tags: [{ // Relación incrustada con los tags
    type: Schema.Types.ObjectId,
    ref: 'Tag', // Relación con el modelo Tag
    required: [true, 'El ID del tag es obligatorio']
    }],
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Usuario' // Relación con el modelo Usuario,
  },
  comentarios: [{ // Relación incrustada con los comentarios
    
    texto: {
      type: String,
      required: [true, 'El texto del comentario es obligatorio']
    },
    fecha: {
      type: Date,
      required: [true, 'La fecha del comentario es obligatoria'],
      default: Date.now
    },
    visible: {
      type: Boolean,
      default: true, // Indica si el comentario es visible  
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
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;