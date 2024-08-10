const mongoose = require("mongoose");

const ProductoSchema = new mongoose.Schema({
  ProductoId: {
    type: String,
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    required: true,
  },
  weight: {
    type: String,
    required: true,
  },
});

const Producto = mongoose.model("Producto", ProductoSchema);

module.exports = Producto;
