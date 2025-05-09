const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  UserId: String,
  email: String,
  name: String,
  photo: String,
});
const User = mongoose.model("User", UserSchema);

module.exports = User;
