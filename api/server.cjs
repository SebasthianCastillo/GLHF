const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const port = 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB
const MONGO_URI = "mongodb+srv://scastillohgo:1234@GLHF.8qefkqx.mongodb.net/";
mongoose
  .connect(MONGO_URI, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error);
  });

app.listen(port, () => {
  console.log("Server is running on port 8000");
});

const Category = require("./model/Category");

app.post("/addCategory", async (req, res) => {
  try {
    const { Name } = req.body;
    const newCategory = new Category({
      Name,
    });
    await newCategory.save();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al agregar una categoría" });
  }
});

app.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);

    await newCategory.save();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al cargar las categorías" });
  }
});
