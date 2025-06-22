import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import Category from "./model/Category.js";
import Producto from "./model/Producto.js";
import ProductDetail from "./model/ProductDetail.js";
import User from "./model/User.js";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import requireAuth from "./middleware/auth.js";
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*", // or restrict to your app origin if needed
    allowedHeaders: ["Content-Type", "Authorization"], // VERY IMPORTANT
  })
);
// Connect to MongoDB
const DB_URL = process.env.DB_URL;

mongoose
  .connect(DB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//#region auth google
/*---------------------- Google Auth---------------------- */

app.post("/google", async (req, res) => {
  const { providerId, name, email, avatar } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    user = new User({
      email,
      name,
      avatar,
      authProviders: [{ provider: "google", providerId }],
    });
  } else {
    const alreadyLinked = user.authProviders.some(
      (p) => p.provider === "google"
    );
    if (!alreadyLinked) {
      user.authProviders.push({ provider: "google", providerId });
    }
  }

  await user.save(); // Se crea el usuario si no existe

  // Genera token JWT con el userId de MongoDB
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token, user }); // Paso 8: Se devuelve token y datos de usuario
});

// Obtener datos del usuario actual desde token

app.get("/currentUser", requireAuth, async (req, res) => {
  res.status(200).json({ user: res.user }); // ← user is set by the middleware
});

//#endregion
// #region Category funcs
app.post("/addCategory", requireAuth, async (req, res) => {
  try {
    const { Name } = req.body;
    const newCategory = new Category({
      Name,
      UserID: req.user._id,
    });
    await newCategory.save();
    res.status(201).json({ message: "Category saved successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al agregar una categoría" });
  }
});
app.get("/categories", requireAuth, async (req, res) => {
  try {
    const categories = await Category.find({ UserId: req.user._id });
    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al cargar las categorías" });
  }
});
// #endregion

// #region Product funcs
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

app.patch("/updateProductName/:id", async (req, res) => {
  const { id } = req.params;
  const { newName } = req.body;

  try {
    // Find the product by ID and update its name
    const updatedProduct = await Producto.findByIdAndUpdate(
      id,
      { Name: newName },
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.status(200).json({
      message: "Nombre del producto actualizado exitosamente",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error al actualizar el nombre del producto:", error);
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
// #endregion
