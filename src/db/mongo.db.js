const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URL ?? "mongodb://admin:admin1234@localhost:27017/producto?authSource=admin";

function connectWithRetry() {
  return mongoose.connect(MONGO_URL)
    .then(() => {
      console.log("✅ Conectado a MongoDB");
    })
    .catch((err) => {
      console.error("❌ Error al conectar con MongoDB. Reintentando en 5 segundos...", err.message);
      return new Promise((resolve) => setTimeout(resolve, 5000))
        .then(connectWithRetry);
    });
}

module.exports = { mongoose, connectWithRetry };