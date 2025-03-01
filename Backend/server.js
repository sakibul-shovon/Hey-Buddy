import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5175"], // Allow both origins
    methods: ["GET", "POST"],
  },
});

// Store connected users (username -> socket ID)
const users = {};
// Store messages (array of { id, sender, recipient, text, timestamp, seen })
const messages = [];

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // User joins with their username
  socket.on("join", (username) => {
    users[username] = socket.id;
    io.emit("userList", Object.keys(users));
    socket.emit("messageHistory", messages.filter((msg) => msg.sender === username || msg.recipient === username));
    console.log("Users:", users);
  });

  // Handle private messages
  socket.on("sendPrivateMessage", ({ recipient, text }) => {
    const sender = Object.keys(users).find((key) => users[key] === socket.id);
    const messageId = Date.now().toString();
    const message = {
      id: messageId,
      sender,
      recipient,
      text,
      timestamp: new Date().toLocaleTimeString(),
      seen: false,
    };
    messages.push(message);

    const recipientSocketId = users[recipient];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("privateMessage", message);
      socket.emit("privateMessage", message);
    }
  });

  // Handle message seen
  socket.on("markAsSeen", (messageId) => {
    const message = messages.find((msg) => msg.id === messageId);
    if (message) {
      message.seen = true;
      const senderSocketId = users[message.sender];
      if (senderSocketId) {
        io.to(senderSocketId).emit("messageSeen", messageId);
      }
    }
  });

  // Handle unsend message
  socket.on("unsendMessage", (messageId) => {
    const messageIndex = messages.findIndex((msg) => msg.id === messageId);
    if (messageIndex !== -1) {
      const message = messages[messageIndex];
      const recipientSocketId = users[message.recipient];
      messages.splice(messageIndex, 1);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("messageUnsent", messageId);
      }
      socket.emit("messageUnsent", messageId);
    }
  });

  // Handle edit message
  socket.on("editMessage", ({ messageId, newText }) => {
    const message = messages.find((msg) => msg.id === messageId);
    if (message) {
      message.text = newText;
      message.timestamp = new Date().toLocaleTimeString();
      const recipientSocketId = users[message.recipient];
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("messageEdited", message);
      }
      socket.emit("messageEdited", message);
    }
  });

  // Handle delete message
  socket.on("deleteMessage", (messageId) => {
    const messageIndex = messages.findIndex((msg) => msg.id === messageId);
    if (messageIndex !== -1) {
      const message = messages[messageIndex];
      const recipientSocketId = users[message.recipient];
      messages.splice(messageIndex, 1);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("messageDeleted", messageId);
      }
      socket.emit("messageDeleted", messageId);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    const username = Object.keys(users).find((key) => users[key] === socket.id);
    if (username) {
      delete users[username];
      io.emit("userList", Object.keys(users));
    }
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Chat server running on port 5000");
});