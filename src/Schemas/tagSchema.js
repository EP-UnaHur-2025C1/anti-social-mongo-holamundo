//const { mongoose } = require('../db/mongo.db')
const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const tagSchema = new mongoose.Schema(
  {
    nombre: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    postId: [{  
      type: Schema.Types.ObjectId, 
      ref: 'Post', //relacion con el modelo Post
    }],
  },
  {
    collection: "tags",
  }
);

tagSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret.__v;
    delete ret._id;
  }
})

const Tag = mongoose.model("Tag", tagSchema);
module.exports = Tag;