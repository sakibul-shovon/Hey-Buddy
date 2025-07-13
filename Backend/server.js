import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Message from "./models/Message.js";

dotenv.config();

const app = express();
const server = createServer(app);

// ✅ Enable CORS for frontend
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
  methods: ["GET", "POST"],
  credentials: true,
}));

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    methods: ["GET", "POST"],
  },
});

// ✅ Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Store connected users (Username → { socketId })
const users = {};

// ✅ API to fetch stored messages
app.get("/api/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);

  socket.on("join", async (username) => {
    if (!username) {
      console.log("❌ Received join request with no username!");
      return;
    }

    console.log(`✅ User joined: ${username}, Socket ID: ${socket.id}`);

    // ✅ Store user with username and socket ID
    users[username] = socket.id;

    // ✅ Emit updated online users list to all clients
    io.emit("userList", Object.keys(users));

    try {
      const chatHistory = await Message.find({
        $or: [{ sender: username }, { recipient: username }],
      }).sort({ timestamp: 1 });

      socket.emit("messageHistory", chatHistory);
    } catch (error) {
      console.error("❌ Error fetching chat history:", error);
    }
  });

  socket.on("sendPrivateMessage", async ({ recipient, text }) => {
    const sender = Object.keys(users).find((key) => users[key] === socket.id);
    if (!sender) return;

    const message = new Message({ sender, recipient, text });

    try {
      await message.save();
      const recipientSocketId = users[recipient];

      if (recipientSocketId) {
        io.to(recipientSocketId).emit("privateMessage", message);
      }
      socket.emit("privateMessage", message);
    } catch (error) {
      console.error("❌ Error saving message:", error);
    }
  });

  socket.on("markAsSeen", async (messageId) => {
    try {
      const message = await Message.findByIdAndUpdate(messageId, { seen: true }, { new: true });
      if (message) {
        const senderSocketId = users[message.sender];
        if (senderSocketId) {
          io.to(senderSocketId).emit("messageSeen", messageId);
        }
      }
    } catch (error) {
      console.error("❌ Error updating seen status:", error);
    }
  });

  socket.on("disconnect", () => {
    const user = Object.keys(users).find((key) => users[key] === socket.id);
    if (user) {
      console.log(`❌ User disconnected: ${user}`);
      delete users[user]; // ✅ Remove from users list
      io.emit("userList", Object.keys(users)); // ✅ Update online user list
    }
  });
});

server.listen(5000, () => {
  console.log("🚀 Chat server running on port 5000");
});
