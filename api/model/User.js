const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: String,
    avatar: String,
    authProviders: [
      {
        provider: {
          type: String,
          enum: ["google", "github", "local"],
          required: true,
        },
        providerId: String,
      },
    ],
    passwordHash: String,
    expoPushToken: String, // For local auth
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

module.exports = User;
