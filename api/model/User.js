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
    settings: {
      reminderSettings: {
        enabled: { type: Boolean },
        intervalDays: { type: Number, default: 7 },
        lowStockThreshold: { type: Number, default: 5 },
      },
    },
    passwordHash: String,
    expoPushToken: String, // For local auth
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

module.exports = User;
