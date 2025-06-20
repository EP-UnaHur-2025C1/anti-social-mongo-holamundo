//const { mongoose } = require('../db/mongo.db')
const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    nickname: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
    },
    password: {
      type: Schema.Types.String,
      required: true
    },
    postId: [{  
      type: Schema.Types.ObjectId, 
      ref: 'Post', //relacion con el modelo Post
    }],
    seguidores: [{  
      type: Schema.Types.ObjectId, 
      ref: 'Usuario', // Relación con el modelo Usuario
    }],
    seguidos: [{  
      type: Schema.Types.ObjectId, 
      ref: 'Usuario', // Relación con el modelo Usuario
    }],
  },
  {
    collection: "usuarios",
  }
);

userSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret.__v;
    delete ret._id;
  }
})

const Usuario = mongoose.model("Usuario", userSchema);
module.exports = Usuario;