const express = require("express");
const { connectToDatabase } = require("./db/mongodb");
const app = express();
const PORT = process.env.PORT ?? 4000;
const Autor = require("./mongoSchemas/autorSchema");

app.use(express.json());

app.get("/", async (_, res) => {
  const autores = await Autor.find({}).sort({ nombre: 1 });
  res.status(200).json(autores);
});

app.get("/:id", async (req, res) => {
  const _id = req.params.id;
  const autores = await Autor.findOne({ _id });
  res.status(200).json(autores);
});

app.post("/", async (req, res) => {
  const autor = await Autor.create(req.body);
  res.status(201).json(autor);
});

app.listen(PORT, async (err) => {
  if (err) {
    console.error(err.message);
    process.exit(1);
  }
  try {
    await connectToDatabase();
  } catch (dbError) {
    console.error(dbError.message);
    process.exit(1);
  }
  console.log(`App iniciada http://localhost:${PORT}`);
});
