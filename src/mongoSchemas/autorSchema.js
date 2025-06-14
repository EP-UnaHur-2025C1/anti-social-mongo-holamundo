const { mongoose } = require("../db/mongodb");
const { Schema } = require("mongoose");

const autorSchema = new mongoose.Schema(
  {
    nickName: {
      type: Schema.Types.String,
      require: true,
      unique: true,
    },
    email: {
      type: Schema.Types.String,
      require: true,
    },
    password: {
      type: Schema.Types.String,
      require: true,
      enum: {
        values: ["M", "F", "B"],
        message: `el genero {VALUES} no esta permitido`,
      },
    },
  },
  {
    collection: "autores",
  }
);

autorSchema.virtual("edad").get(function () {
  return Math.floor(
    (new Date() - new Date(this.fechaNacimiento)) /
      (1000 * 60 * 60 * 24 * 365.25)
  );
});

autorSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    delete ret.__v;
    delete ret._id;
  },
});

const Autor = mongoose.model("Autor", autorSchema);
module.exports = Autor;
