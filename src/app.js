const express = require('express');
const routes = require('./routes/index.routes');
const { mongoose, connectToDatabase } = require('./db/mongo.db');
const initData = require('./init/data')

const PORT = process.env.PORT || 3000 

const app = express()
app.use(express.json())

app.use(routes.productosRoute)
app.use(routes.fabricantesRoute)


app.listen(PORT, async() => {
    await connectToDatabase();
    await initData();
    console.log(` \u{1F680} Aplicación iniciada en el puerto ${PORT} - http://localhost:${PORT}/`)
})