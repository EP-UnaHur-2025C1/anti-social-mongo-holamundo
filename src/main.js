const express = require("express");
const db = require("./db/models");
const { userRoute, commentRoute, postRoute, tagRoute, imageRoute} = require("./routes");
const app = express();
require('dotenv').config()
const PORT = process.env.PORT || 3001;

//llamado a swaggerInit
const swaggerInit = require("./swagger/swaggerInit.js");
swaggerInit(app)

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/users", userRoute);
app.use("/comments", commentRoute);
app.use("/posts", postRoute);
app.use("/tags",tagRoute);
app.use("/images",imageRoute)

app.listen(PORT, async () => {
  console.log(`La app arranco en el puerto ${PORT}.`);
  //await db.sequelize.sync({ force: true });
  await db.sequelize.sync();
});