const mongoose = require("mongoose");

const ProductoSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  CategoryID: {
    type: String,
    required: true,
  },
});

const Producto = mongoose.model("Producto", ProductoSchema);

module.exports = Producto;
