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
import { chromium } from "playwright";
import cron from "node-cron";
import axios from "axios";
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

app.post("/updateUserSettings", async (req, res) => {
  try {
    const { group, userEmail, ...updates } = req.body;

    // Check user existence
    const existingUser = await User.findOne({ email: userEmail });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only provided fields
    const mappedUpdates = {};
    for (const key in updates) {
      mappedUpdates[`settings.${group}.${key}`] = updates[key];
    }
    await User.updateOne({ email: userEmail }, { $set: mappedUpdates });
    console.log(`✅ Updated settings for: ${existingUser.name}`);

    res.status(200).json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("❌ Error updating user settings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
cron.schedule("*/20 * * * *", async () => {
  // Get all users with notification enabled
  const usersNotificationEnabled = await User.find({
    "settings.reminderSettings.enabled": true,
  });
  for (const user of usersNotificationEnabled) {
    const { intervalDays, lowStockThreshold } = user.settings.reminderSettings;
    const lowStockProducts = await Producto.find({
      quantity: { $lt: lowStockThreshold },
    });
    const intervalMs = intervalDays * 24 * 60 * 60 * 1000;
    for (const product of lowStockProducts) {
      // Check if we already reminded in the last hour
      const lastNotified = product.lastNotifiedAt;
      const now = new Date();
      if (!lastNotified || now - lastNotified > intervalMs) {
        // Find the user who owns this product
        const productPopulated = await Producto.findById(product._id).populate({
          path: "CategoryID", // Step 1: replace CategoryID with actual Category document
          populate: { path: "UserID", model: "User" }, // Step 2: inside Category, populate UserID
        });
        const user = productPopulated.CategoryID.UserID;

        if (user.expoPushToken && user.settings.reminderSettings.enabled) {
          // Send notification
          await sendPushNotification(user.expoPushToken, {
            title: "Low Stock Reminder 🛒",
            body: `${product.Name} is low (${product.quantity} left)!`,
          });

          // Update last notified time
          product.lastNotifiedAt = now;
          await product.save();
        }
      }
    }
  }
});
async function sendPushNotification(expoPushToken, message) {
  try {
    await axios.post(
      "https://exp.host/--/api/v2/push/send",
      {
        to: expoPushToken,
        sound: "default",
        title: message.title,
        body: message.body,
      },
      {
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Notification sent!");
  } catch (error) {
    console.error(
      "Failed to send push notification:",
      error.response?.data || error.message
    );
  }
}
// notification save token
app.post("/saveTokenUserNotification", async (req, res) => {
  try {
    const { userEmail, expoPushToken } = req.body;
    if (!userEmail || !expoPushToken) {
      return res
        .status(400)
        .json({ message: "Missing userEmail or expoPushToken" });
    }
    await User.findOneAndUpdate(
      { email: userEmail }, // find condition
      { expoPushToken: expoPushToken } // fields to update
    );
    res.status(200).json({ message: "Push token saved successfully" });
  } catch (error) {
    console.error("Error saving push token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
app.get("/getMonthlySummaries", async (req, res) => {
  const productID = req.query.ProductKey;
  try {
    const result = await ProductDetail.aggregate([
      // Filter by ProductID
      {
        $match: {
          ProductID: productID,
        },
      },

      // Extract year and month from date
      {
        $addFields: {
          year: { $year: "$date" },
          month: { $month: "$date" },
        },
      },

      // Group by year and month, compute added and removed
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          added: {
            $sum: {
              $cond: [
                { $eq: [{ $toLower: "$operation" }, "add"] },
                "$quantity",
                0,
              ],
            },
          },
          removed: {
            $sum: {
              $cond: [
                { $eq: [{ $toLower: "$operation" }, "minus"] },
                "$quantity",
                0,
              ],
            },
          },
        },
      },

      // Add month name
      {
        $addFields: {
          year: "$_id.year",
          month: "$_id.month",
          monthName: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id.month", 1] }, then: "January" },
                { case: { $eq: ["$_id.month", 2] }, then: "February" },
                { case: { $eq: ["$_id.month", 3] }, then: "March" },
                { case: { $eq: ["$_id.month", 4] }, then: "April" },
                { case: { $eq: ["$_id.month", 5] }, then: "May" },
                { case: { $eq: ["$_id.month", 6] }, then: "June" },
                { case: { $eq: ["$_id.month", 7] }, then: "July" },
                { case: { $eq: ["$_id.month", 8] }, then: "August" },
                { case: { $eq: ["$_id.month", 9] }, then: "September" },
                { case: { $eq: ["$_id.month", 10] }, then: "October" },
                { case: { $eq: ["$_id.month", 11] }, then: "November" },
                { case: { $eq: ["$_id.month", 12] }, then: "December" },
              ],
              default: "Unknown",
            },
          },
        },
      },

      // Group months under each year
      {
        $group: {
          _id: "$year",
          months: {
            $push: {
              year: "$year",
              month: "$month",
              monthName: "$monthName",
              added: "$added",
              removed: "$removed",
            },
          },
        },
      },

      // Sort years descending
      {
        $sort: {
          _id: -1,
        },
      },

      // Sort months inside each year descending
      {
        $addFields: {
          months: {
            $sortArray: {
              input: "$months",
              sortBy: { month: -1 },
            },
          },
        },
      },

      // Group everything into one doc
      {
        $group: {
          _id: null,
          years: { $push: "$_id" },
          dataByYear: {
            $push: {
              k: { $toString: "$_id" },
              v: "$months",
            },
          },
        },
      },

      // Convert dataByYear into object
      {
        $project: {
          _id: 0,
          years: 1,
          dataByYear: {
            $arrayToObject: "$dataByYear",
          },
        },
      },
    ]);

    res.status(200).json(result[0] || {});
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error al cargar product detail monthly summaries" });
  }
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
    const userId = req.res.user._id.toString();

    const newCategory = new Category({
      Name,
      UserID: userId,
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
    if (!req.res.user) {
      return res.status(401).json({ message: "User not found" });
    }
    const userId = req.res.user._id.toString();
    const categories = await Category.find({
      UserID: userId,
    }).sort("-Name");
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
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

    const products = await Producto.find({
      CategoryID: CategoryID,
    }).sort("Name");

    res.status(200).json(products);
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
// #endregion
// #region ProductDetail funcs
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
// #endregion
// #region PDF export products
app.get("/generate-pdf/:id", async (req, res) => {
  try {
    const productsByCategory = await Producto.find({
      CategoryID: req.params.id,
    });
    const { Name: CategoryName } = await Category.findById(req.params.id);

    if (!productsByCategory?.length) {
      return res.status(404).send("No products found for this category");
    }
    const rowsHtml = productsByCategory
      .map(
        (p) => `
        <tr>
          <td>${p.Name ?? ""}</td>
          <td>${p.quantity ?? ""}</td>
        </tr>`
      )
      .join("");

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
     <style>
  body {
    font-family: "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #1f2937;
    background: #ffffff;
    margin: 0;
    padding: 60px;
    line-height: 1.6;
  }

  .container {
    max-width: 900px;
    margin: 0 auto;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    padding: 50px 60px;
    border-radius: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  }

  .date {
    text-align: right;
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 20px;
  }

  .title {
    font-size: 32px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 20px;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 8px;
    letter-spacing: -0.02em;
  }

  .accent-bar {
    height: 5px;
    width: 60px;
    background: linear-gradient(90deg, #2563eb, #3b82f6);
    border-radius: 4px;
    margin: 20px 0 40px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 30px;
    font-size: 15px;
  }

  th, td {
    padding: 12px 10px;
    border-bottom: 1px solid #e5e7eb;
  }

  th {
    background-color: #f3f4f6;
    color: #374151;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-size: 13px;
    text-align: left;
  }

  th:nth-child(2) {
    text-align: center;
  }

  td {
    color: #374151;
    text-align: left;
  }

  td:nth-child(2) {
    text-align: center;
  }

  tr:nth-child(even) td {
    background-color: #f9fafb;
  }

  tr:hover td {
    background-color: #f3f4f6;
  }

  /* Headings and subtle structure */
  h2, h3 {
    margin-top: 40px;
    color: #111827;
    font-weight: 600;
  }

  p {
    margin: 12px 0;
    font-size: 15px;
  }

  
  }
</style>
    </head>
    <body>
      <div class="container">
        <div class="date">${new Date().toLocaleDateString()}</div>
        <div class="title">${CategoryName}</div>
        <table>
          <thead>
            <tr><th>Name</th><th>Quantity</th></tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
    </body>
    </html>`;

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle" });
    const pdf = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="report.pdf"');
    res.send(pdf);
    // res.send(pdf);
  } catch (err) {
    console.error("PDF error:", err);
    res.status(500).send("Failed to generate PDF");
  }
});
// #endregion
app.get("/", async (req, res) => {
  try {
    res.send("hello");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error" });
  }
});
// #endregion
