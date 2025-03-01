import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("❌ MongoDB URI is missing. Check your .env file.");
  process.exit(1);
}

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB Atlas (HeyBuddy DB)!"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err);
  });

// ✅ Define User Schema (References ProfilePictures)
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePictureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProfilePictures",
    default: null,
  },
});

// ✅ Define Profile Picture Schema (Separate Collection)
const profilePictureSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserCollection",
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Create Models
const UserCollection = mongoose.model("UserCollection", userSchema);
const ProfilePictures = mongoose.model("ProfilePictures", profilePictureSchema);

// ✅ Export Models
export { UserCollection, ProfilePictures };