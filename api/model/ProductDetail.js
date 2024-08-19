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
});

const ProductDetail = mongoose.model("ProductDetail", ProductDetailSchema);

module.exports = ProductDetail;
