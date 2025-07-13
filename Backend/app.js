import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";
import { createServer } from "http"; // Import createServer for Socket.IO
import { Server } from "socket.io"; // Import Server from socket.io
import { UserCollection, ProfilePictures } from "./models/User.js";
<<<<<<< HEAD
import userRoutes from './routes/userRoutes.js'; // Import user routes
import projectRoutes from './routes/projectRoutes.js'; // Import project routes
=======
import projectRoutes from './routes/projectRoutes.js';
import microprojectsRoutes from './routes/microprojectsRoutes.js';
>>>>>>> main

dotenv.config();

const app = express();
const server = createServer(app); // Create an HTTP server for Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow frontend origin
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);
app.use('/api', microprojectsRoutes);

// ✅ Ensure Environment Variables Exist
const mongoURI = process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET;

if (!mongoURI || !jwtSecret) {
  console.error("❌ Missing required environment variables. Check your .env file.");
  process.exit(1);
}

// ✅ Connect to MongoDB Atlas
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

/* ----- JWT Middleware ----- */
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  // Check if the token is provided
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    // Verify the token using jwtSecret from environment
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;  // Attach the decoded user data to the request
    next();  // Proceed to the next middleware
  } catch (error) {
    console.error("Token verification failed:", error);  // Log the error for debugging
    return res.status(403).json({ error: "Invalid or expired token" });  // Invalid or expired token error
  }
};

/* ----- User Authentication Routes ----- */

// ✅ Signup Route
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await UserCollection.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserCollection.create({ email, password: hashedPassword });

    // ✅ Generate JWT Token
    const token = jwt.sign({ email: newUser.email, id: newUser._id }, jwtSecret, { expiresIn: "7d" });

    res.status(201).json({ token, email: newUser.email });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserCollection.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Compare Passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign({ email: user.email, id: user._id }, jwtSecret, { expiresIn: "7d" });

    res.status(200).json({ token, email: user.email });
  } catch (error) {
    console.error("❌ Login Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/* ----- Cloudinary Integration ----- */

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ----- Profile Picture Routes ----- */

// ✅ Upload Profile Picture & Save in MongoDB
app.post("/api/user/profile", authenticateUser, async (req, res) => {
  const {
    name,
    bio,
    title,
    githubUrl,
    portfolio,
    skills,
    experience,
    interests,
    profilePicture,
    friendsToAdd, // Assume this is an array of friend userIds to add
    friendsToRemove, // Array of userIds to remove
  } = req.body;

  try {
    const user = await UserCollection.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user profile details
    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (title) user.title = title;
    if (githubUrl) user.githubUrl = githubUrl;
    if (portfolio) user.portfolio = portfolio;
    if (skills) user.skills = skills;
    if (experience) user.experience = experience;
    if (interests) user.interests = interests;

    // Handle profile picture update if present
    if (profilePicture) {
      const updatedProfilePic = await ProfilePictures.findOneAndUpdate(
        { userId: user._id },
        { url: profilePicture.url, publicId: profilePicture.publicId },
        { new: true, upsert: true }
      );
      user.profilePictureId = updatedProfilePic._id;
    }

    // Handle friends update (add/remove)
    if (friendsToAdd && Array.isArray(friendsToAdd)) {
      user.friends = [...user.friends, ...friendsToAdd];
    }

    if (friendsToRemove && Array.isArray(friendsToRemove)) {
      user.friends = user.friends.filter(friendId => !friendsToRemove.includes(friendId));
    }

    await user.save();
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});



// ✅ Fetch User Profile Picture
// Fetch User Profile Picture and Other User Data
// Fetch User Profile Picture and Other User Data
app.get("/api/user/profile", authenticateUser, async (req, res) => {
  try {
    const user = await UserCollection.findById(req.user.id)
      .populate("profilePictureId") // Populating profile picture
      .populate("friends"); // Populate friends array to return full user details of friends

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Returning the full user data, including the profile picture URL and friends
    res.json({
      name: user.name,
      bio: user.bio,
      skills: user.skills,
      experience: user.experience,
      interests: user.interests,
      title: user.title,
      githubUrl: user.githubUrl,
      portfolio: user.portfolio,
      profilePicture: { url: user.profilePictureId?.url }, // Profile picture URL
      friends: user.friends.map(friend => ({
        name: friend.name,
        title: friend.title,
        profilePicture: friend.profilePictureId?.url, // Friend's profile picture
      })),
    });
  } catch (err) {
    console.error("❌ Error fetching profile:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});


// Fetch users
// Fetch users with populated profile picture
app.get("/api/users", authenticateUser, async (req, res) => {
  try {
    const users = await UserCollection.find()
      .populate("profilePictureId")  // Populate the profile picture field
      .exec();
    res.status(200).json(users);  // Send users with profile picture data
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});


// Add friend to a user's friends list
app.post("/api/user/add-friend", authenticateUser, async (req, res) => {
  const { friendId } = req.body;
  console.log("Ok!");

  try {
    const user = await UserCollection.findById(req.user.id);
    const friend = await UserCollection.findById(friendId);

    console.log(req.user.id); console.log(friendId);

    if (!user || !friend) {
      return res.status(404).json({ error: "User or friend not found" });
    }

    // Add the friend to the user's friend list (bi-directional)
    if (!user.friends.includes(friendId)) {
      user.friends.push(friendId);
    }

    if (!friend.friends.includes(req.user.id)) {
      friend.friends.push(req.user.id);
    }

    await user.save();
    await friend.save();

    res.status(200).json({ message: "Friend added successfully" });
  } catch (err) {
    console.error("Error adding friend:", err);
    res.status(500).json({ error: "Failed to add friend" });
  }
});



app.get("/api/cloudinary-signature", authenticateUser, (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    // Define parameters you want to sign. You can include more parameters if needed.
    const paramsToSign = {
      timestamp,
      folder: "profile_pictures"  // Change this as required
    };

    // Generate signature using your Cloudinary API secret.
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    res.status(200).json({ timestamp, signature, folder: paramsToSign.folder });
  } catch (error) {
    console.error("Error generating Cloudinary signature:", error);
    res.status(500).json({ error: "Failed to generate Cloudinary signature" });
  }
});

// ✅ Delete Profile Picture from Cloudinary & MongoDB
app.delete("/api/user/profile", authenticateUser, async (req, res) => {
  try {
    // ✅ Find User and Get Profile Picture ID
    const user = await UserCollection.findById(req.user.id).populate("profilePictureId");
    if (!user || !user.profilePictureId) {
      return res.status(404).json({ error: "No profile picture found" });
    }

    const profilePic = user.profilePictureId;

    // ✅ Delete from Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.destroy(profilePic.publicId);
    if (cloudinaryResponse.result !== "ok") throw new Error("Cloudinary deletion failed");

    // ✅ Remove Profile Picture from Database
    await ProfilePictures.findByIdAndDelete(profilePic._id);

    // ✅ Remove Profile Picture Reference from User
    user.profilePictureId = null;
    await user.save();

    res.status(200).json({ message: "Profile picture deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting profile picture:", err);
    res.status(500).json({ error: "Failed to delete profile picture" });
  }
});

<<<<<<< HEAD
// Use user routes
app.use('/api', userRoutes);

// Use project routes
app.use('/api', projectRoutes);

/* ----- Socket.IO Setup ----- */
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

=======
app.use('/api', projectRoutes);

>>>>>>> main
/* ----- Server Start ----- */
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});