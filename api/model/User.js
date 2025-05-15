const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  authProvider: { type: String, required: true }, // 'google', 'github', 'local', etc.
  providerId: { type: String, required: true }, // ID del usuario en el proveedor externo (o email para login local)
  email: String,
  name: String,
  passwordHash: String, // solo para login local
});

const User = mongoose.model("User", userSchema);

module.exports = User;
