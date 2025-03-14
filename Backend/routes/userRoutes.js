import express from "express";
import { UserCollection, ProfilePictures } from "../models/User.js"; // Import models
import cloudinary from "cloudinary";

const router = express.Router();

// ✅ Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Generate Cloudinary Signature
router.get("/cloudinary-signature", (req, res) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = { timestamp, folder: "profile_pictures" };

    const signature = cloudinary.v2.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({ timestamp, signature, folder: "profile_pictures" });
  } catch (err) {
    console.error("❌ Error generating Cloudinary signature:", err);
    res.status(500).json({ error: "Failed to generate Cloudinary signature" });
  }
});

// ✅ Upload Profile Picture & Save in MongoDB
router.post("/user/profile", async (req, res) => {
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
router.get("/user/profile", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required" });

    // ✅ Find user
    const user = await UserCollection.findOne({ email }).populate("profilePictureId");
    if (!user || !user.profilePictureId) {
      return res.status(404).json({ error: "No profile picture found" });
    }

    res.json({ profilePicture: user.profilePictureId });
  } catch (err) {
    console.error("❌ Error fetching profile picture:", err);
    res.status(500).json({ error: "Failed to fetch profile picture" });
  }
});

// ✅ Delete Profile Picture from Cloudinary & MongoDB
router.delete("/user/profile", async (req, res) => {
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

router.post('/login', async (req, res) => {
  // ...existing code to authenticate user...

  // Assuming user is authenticated and user object is available
  const user = await UserCollection.findById(userId);
  user.loginDates.push(new Date());
  await user.save();

  res.status(200).json({ message: 'Login successful', user });
});

router.get('/login-dates', async (req, res) => {
  const userId = req.user.id; // Assuming user ID is available in req.user
  const user = await User.findById(userId);
  res.status(200).json({ loginDates: user.loginDates });
});

export default router;
