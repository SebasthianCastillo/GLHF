const mongoose = require("mongoose");
const ProductDetailSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  format: {
    type: String,
    required: true,
  },
  operation: {
    type: String,
    required: true,
  },
  ProductID: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    default: 0,
  },
});

const ProductDetail = mongoose.model("ProductDetail", ProductDetailSchema);

module.exports = ProductDetail;
