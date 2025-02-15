import mongoose from "mongoose";

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || "mongodb://0.0.0.0:27017/react-login-tut";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
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
