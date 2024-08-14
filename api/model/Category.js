const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema({
  CategoryId: {
    type: String,
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
});

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
