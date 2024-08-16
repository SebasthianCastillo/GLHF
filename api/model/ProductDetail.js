const mongoose = require("mongoose");
const ProductDetailSchema = new mongoose.Schema({
  ProductDetailId: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    required: true,
  },
});

const ProductDetail = mongoose.model("ProductDetail", ProductDetailSchema);

module.exports = ProductDetail;
