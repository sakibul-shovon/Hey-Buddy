import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true
}));

// ✅ Connect to MongoDB Atlas
const mongoURI = process.env.MONGO_URI || "mongodb+srv://zawad:admin1234@heybuddy.wfcam.mongodb.net/HeyBuddy?retryWrites=true&w=majority";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Define User Schema & Model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("UserCollection", userSchema);

// ✅ Signup Route with Hashed Passwords
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
    console.error("❌ Signup Error:", error);
    return res.status(500).json("fail");
  }
});

// ✅ Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json("notexist");
    }

    // ✅ Compare Passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return res.json("exist");
    } else {
      return res.json("wrongpassword");
    }
  } catch (error) {
    console.error("❌ Login Error:", error);
    return res.status(500).json("fail");
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
