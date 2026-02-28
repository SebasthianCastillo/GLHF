// Connect to MongoDB
const DB_URL = process.env.DB_URL;
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Mongo connected");
  } catch (err) {
    console.error("Mongo connection error:", err);
    process.exit(1);
  }
};
export default connectDB;
