const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  UserID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
