import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import Category from "./model/Category.js";
import Producto from "./model/Producto.js";
import ProductDetail from "./model/ProductDetail.js";
import { MongoClient, ObjectId } from "mongodb";

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
const DB_URL = process.env.DB_URL;

mongoose
  .connect(DB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
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
    const { Name, quantity, CategoryID } = req.body;
    const newProducto = new Producto({
      Name,
      quantity,
      CategoryID,
    });
    await newProducto.save();
    res.status(201).json({ message: "Product saved successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al agregar un producto" });
  }
});

app.post("/addProductDetail", async (req, res) => {
  try {
    const { quantity, date, format, operation, ProductID } = req.body;
    const newProductDetail = new ProductDetail({
      quantity,
      date,
      format,
      operation,
      ProductID,
    });

    await newProductDetail.save();
    res.status(201).json({ message: "Product Detail saved successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error al agregar el detalle de producto" });
  }
});
app.patch("/quantityUpdateProduct", async (req, res) => {
  const { _id, quantity, operation } = req.body;
  // Los cambios a realizar deben venir en el cuerpo de la solicitud
  const filter = { _id: new ObjectId(_id) };

  // Definir la actualización: incrementar o decrementar el campo
  const update = {
    $inc: { quantity: operation === "add" ? quantity : -quantity },
  };
  try {
    // Actualizar el documento
    await Producto.updateOne(filter, update);

    res.status(201).json({ message: "Product Detail saved successfully" });
  } catch (error) {
    res.status(500).send("Error al actualizar el documento");
    res.status(500).json({ message: "Internal Server Error" });
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

app.get("/productsByIDCategory", async (req, res) => {
  try {
    const CategoryID = req.query.CategoryKey;
    const products = await Producto.find({ CategoryID: CategoryID });
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al cargar los productos" });
  }
});
app.get("/productDetailSummaryByOperationAdd", async (req, res) => {
  try {
    const ProductID = req.query.ProductKey;
    const currentMonth = new Date(req.query.currentMonth);
    const startOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    );

    const ProductDetailSummary = await ProductDetail.aggregate([
      {
        $match: {
          operation: "add",
          ProductID: ProductID, // Añadir ProductID al match
          date: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null, // No agrupar por ProductID, solo sumar
          totalQuantity: { $sum: "$quantity" },
        },
      },
    ]);

    const totalQuantity =
      ProductDetailSummary.length > 0
        ? ProductDetailSummary[0].totalQuantity
        : 0;

    // Devolver como texto plano
    console.log(totalQuantity);
    res.status(200).json(ProductDetailSummary);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al cargar los productos" });
  }
});

app.get("/productDetailSummaryByOperationMinus", async (req, res) => {
  try {
    const ProductID = req.query.ProductKey;
    const currentMonth = new Date(req.query.currentMonth);
    const startOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    );

    const ProductDetailSummary = await ProductDetail.aggregate([
      {
        $match: {
          operation: "minus",
          ProductID: ProductID, // Añadir ProductID al match
          date: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null, // No agrupar por ProductID, solo sumar
          totalQuantity: { $sum: "$quantity" },
        },
      },
    ]);

    const totalQuantity =
      ProductDetailSummary.length > 0
        ? ProductDetailSummary[0].totalQuantity
        : 0;

    // Devolver como texto plano
    console.log(totalQuantity);
    res.status(200).json(ProductDetailSummary);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al cargar los productos" });
  }
});

app.get("/productDetailByIDProduct", async (req, res) => {
  try {
    const ProductID = req.query.ProductKey;
    const productDetail = await ProductDetail.find({ ProductID: ProductID });
    res.status(200).json(productDetail);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al cargar los productos" });
  }
});
app.delete("/deleteProduct/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Busca el producto por ID y elimínalo
    const result = await Producto.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Envía una respuesta exitosa
    res.status(200).json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
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
