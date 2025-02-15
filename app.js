import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());  // Allow requests from React frontend

// Connect to MongoDB (Ensure the database exists)
const mongoURI = "mongodb://127.0.0.1:27017/react-login-tut";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Define User Schema & Model
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
const User = mongoose.model("UserCollection", userSchema);

// Signup Route
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json("exist");
    } else {
      await User.create({ email, password });
      return res.json("notexist");
    }
  } catch (error) {
    console.error("❌ Signup Error:", error);
    return res.status(500).json("fail");
  }
});

// Start Server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
