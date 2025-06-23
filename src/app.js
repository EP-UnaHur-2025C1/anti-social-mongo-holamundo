const express = require('express');
const routes = require('./routes/index.routes');
const { mongoose, connectToDatabase } = require('./db/mongo.db');
const initData = require('./init/data')


const PORT = process.env.PORT || 3000 
const app = express()
//Swagger
const swaggerInit = require("./swagger/swaggerInit.js")
swaggerInit(app)

app.use(express.json())

app.use(routes.userRoute)
app.use(routes.postRoute)
app.use(routes.tagRoute)
app.use(routes.imageRoute)


app.listen(PORT, async() => {
    await connectToDatabase();
    await initData();
    console.log(` \u{1F680} Aplicación iniciada en el puerto ${PORT} - http://localhost:${PORT}/usuarios`)
})