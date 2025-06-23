const express = require('express');
const routes = require('./routes/index.routes');
const { mongoose, connectWithRetry } = require('./db/mongo.db');
const initData = require('./init/data');

const PORT = process.env.PORT || 3006;
const app = express();

// Swagger
const swaggerInit = require("./swagger/swaggerInit.js");
swaggerInit(app);

app.use(express.json());

app.use(routes.userRoute);
app.use(routes.postRoute);
app.use(routes.tagRoute);
app.use(routes.imageRoute);

app.listen(PORT, async () => {
  await connectWithRetry();
  await initData();
  console.log(`🚀 Aplicación iniciada en el puerto ${PORT} - http://localhost:${PORT}/usuarios`);
});