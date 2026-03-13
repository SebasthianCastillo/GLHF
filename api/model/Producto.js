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
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  lastNotifiedAt: Date,
  cost: {
    type: Number,
    default: 0,
  },
  totalSpent: {
    type: Number,
    default: 0,
  },
});

const Producto = mongoose.model("Producto", ProductoSchema);

module.exports = Producto;
