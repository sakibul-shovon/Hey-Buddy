import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import { UserCollection, ProfilePictures } from "./models/User.js"; // Ensure correct import

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);

// ✅ Connect to MongoDB Atlas
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("❌ MongoDB URI is missing. Check your .env file.");
  process.exit(1);
}

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

/* ----- User Authentication Routes ----- */

// ✅ Signup Route
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await UserCollection.findOne({ email });

    if (existingUser) {
      return res.json("exist");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await UserCollection.create({ email, password: hashedPassword });

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
    const user = await UserCollection.findOne({ email });

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

/* ----- Cloudinary Integration ----- */

// ✅ Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


/* ----- Profile Picture Routes ----- */

// ✅ Upload Profile Picture & Save in MongoDB
app.post("/api/user/profile", async (req, res) => {
  try {
    const { email, profilePicture } = req.body;
    if (!email || !profilePicture?.url || !profilePicture?.publicId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Find the User
    const user = await UserCollection.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // ✅ Check if a profile picture already exists
    let existingProfilePic = await ProfilePictures.findOne({ userId: user._id });

    if (existingProfilePic) {
      // ✅ Update existing profile picture
      existingProfilePic.url = profilePicture.url;
      existingProfilePic.publicId = profilePicture.publicId;
      await existingProfilePic.save();
    } else {
      // ✅ Create new profile picture entry
      existingProfilePic = await ProfilePictures.create({
        userId: user._id,
        url: profilePicture.url,
        publicId: profilePicture.publicId,
      });
    }

    // ✅ Update User Collection to store reference
    user.profilePictureId = existingProfilePic._id;
    await user.save();

    res.json({ message: "Profile picture updated", profilePicture: existingProfilePic });
  } catch (err) {
    console.error("❌ Error updating profile picture:", err);
    res.status(500).json({ error: "Failed to update profile picture" });
  }
});


// ✅ Get User Profile Picture
app.get("/api/cloudinary-signature", (req, res) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000); // Generate timestamp
    const paramsToSign = { timestamp, folder: "profile_pictures" }; // Include folder

    // ✅ Generate a signature based on ALL parameters (folder + timestamp)
    const signature = cloudinary.v2.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({ timestamp, signature, folder: "profile_pictures" }); // ✅ Return folder
  } catch (err) {
    console.error("❌ Error generating Cloudinary signature:", err);
    res.status(500).json({ error: "Failed to generate Cloudinary signature" });
  }
});




// ✅ Delete Profile Picture from Cloudinary & MongoDB
app.delete("/api/user/profile", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    // ✅ Find User and Get Profile Picture ID
    const user = await UserCollection.findOne({ email }).populate("profilePictureId");
    if (!user || !user.profilePictureId) {
      return res.status(404).json({ error: "No profile picture found" });
    }

    const profilePic = user.profilePictureId;

    // ✅ Delete from Cloudinary
    await cloudinary.v2.uploader.destroy(profilePic.publicId);

    // ✅ Remove Profile Picture from ProfilePictures Collection
    await ProfilePictures.findByIdAndDelete(profilePic._id);

    // ✅ Remove Profile Picture Reference from User
    user.profilePictureId = null;
    await user.save();

    res.json({ message: "Profile picture deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting profile picture:", err);
    res.status(500).json({ error: "Failed to delete profile picture" });
  }
});


/* ----- Server Start ----- */
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
