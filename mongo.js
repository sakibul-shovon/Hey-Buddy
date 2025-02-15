import mongoose from "mongoose";
import dotenv from "dotenv";

// ✅ Load environment variables
dotenv.config();

// ✅ Use MongoDB Atlas connection from .env
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("❌ MongoDB URI is missing. Check your .env file.");
  process.exit(1);
}

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB Atlas (HeyBuddy DB)!"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

// Define Schema
const newSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Create Model
const collection = mongoose.model("UserCollection", newSchema);

// Export Model for ES Modules
export default collection;
