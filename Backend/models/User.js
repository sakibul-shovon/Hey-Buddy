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

// ✅ Define User Schema (References ProfilePictures and friends)
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
    ref: "ProfilePictures", // Reference to ProfilePictures model
    default: null,
  },
  name: {
    type: String,
    required: false,  // Non-required field
    default: null,
  },
  title: {
    type: String,
    required: false,  // Non-required field
    default: null,
  },
  experience: {
    type: String,
    required: false,  // Non-required field
    default: null,
  },
  skills: {
    type: [String],
    required: false,  // Non-required field
  },
  interests: {
    type: [String],
    required: false,  // Non-required field
  },
  lookingFor: {
    type: [String],
    required: false,  // Non-required field
    default: null,
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserCollection",  // Reference to the UserCollection model
    required: false,
    default: [],
  }],
  githubUrl: {
    type: String,
    required: false,  // Non-required field
    default: null,
  },
  portfolio: {
    type: String,
    required: false,  // Non-required field
    default: null,
  },
  bio: {
    type: String,
    required: false,  // Non-required field
    default: null,
  },
  image: {
    type: String,
    required: false,  // Non-required field
    default: null,
  },
  loginDates: {
    type: [Date],
    default: []
  }
});

// ✅ Define Profile Picture Schema (Separate Collection)
const profilePictureSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserCollection",  // Reference to the UserCollection model
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
