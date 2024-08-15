import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import Category from "./model/Category.js";
import Category from "./model/Producto.js";
import Producto from "./model/Producto.js";
// const Category = require("./model/Category.js");

const app = express();
const port = 5000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
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
  console.log(`Server is running on port ${port}`);
});

app.post("/addCategory", async (req, res) => {
  try {
    const { Name } = req.body;
    const newCategory = new Category({
      Name,
    });
    await newCategory.save();
    res.status(201).json({ message: "Category saved successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al agregar una categoría" });
  }
});
app.post("/addProduct", async (req, res) => {
  try {
    const { Name, date, type, format, weight, CategoryID } = req.body;
    const newProducto = new Producto({
      Name,
      date,
      type,
      format,
      weight,
      CategoryID,
    });
    await newProducto.save();
    res.status(201).json({ message: "Product saved successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al agregar un producto" });
  }
});

app.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al cargar las categorías" });
  }
});

app.get("/", async (req, res) => {
  try {
    res.send("hello");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error" });
  }
});
