import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to MongoDB
const mongoURI = "mongodb://127.0.0.1:27017/react-login-tut";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Define User Schema & Model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("UserCollection", userSchema);

// **Login Route**
app.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json("notexist");
    }

    // **Compare Passwords**
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return res.json("exist");
    } else {
      return res.status(401).json("wrongpassword");
    }
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json("fail");
  }
});

// **Signup Route (Hash Passwords)**
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json("exist");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({ email, password: hashedPassword });

      return res.json("notexist");
    }
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json("fail");
  }
});

// **Start Server**
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
