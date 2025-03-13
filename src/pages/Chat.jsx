import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { AuthContext } from "../context/AuthContext";
import { Send, User } from "lucide-react";

const socket = io("http://localhost:5000");

const Chat = () => {
  const { username } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    console.log("Joining chat as:", username);
    socket.emit("join", username);

    socket.on("userList", (userList) => {
      console.log("Updated Online Users:", userList);
      setUsers(userList.filter((u) => u !== username));
    });

    socket.on("messageHistory", (history) => {
      setMessages(history);
    });

    socket.on("privateMessage", (msg) => {
      console.log("New message received:", msg);
      setMessages((prevMessages) => {
        const messageExists = prevMessages.some((m) => m.timestamp === msg.timestamp);
        return messageExists ? prevMessages : [...prevMessages, msg];
      });
    });

    return () => {
      socket.off("userList");
      socket.off("messageHistory");
      socket.off("privateMessage");
    };
  }, [username]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && selectedUser) {
      const newMessage = {
        sender: username,
        recipient: selectedUser,
        text: message,
        timestamp: new Date().toISOString(),
      };

      socket.emit("sendPrivateMessage", newMessage);
      setMessage(""); // ✅ Clears input without causing duplicate messages
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-6 min-h-screen flex flex-col">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-teal-600 dark:text-teal-400 tracking-tight text-center sm:text-left">
        // Private Chat Terminal
      </h1>

      <div className="flex flex-1 gap-4 sm:gap-6 flex-col sm:flex-row">
        {/* User List */}
        <div className="w-full sm:w-1/3 bg-gray-200 dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center space-x-2">
            <User size={18} className="text-green-500 dark:text-green-400" />
            <span>Online Users</span>
          </h2>
          <ul className="space-y-3">
            {users.map((user) => (
              <li
                key={user}
                onClick={() => setSelectedUser(user)}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 flex items-center ${
                  selectedUser === user
                    ? "bg-teal-500 text-white shadow-md"
                    : "hover:bg-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span>{user}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Area */}
        <div className="w-full sm:w-2/3 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700">
          <div className="p-4 bg-gray-300 dark:bg-gray-700 rounded-t-lg flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {selectedUser ? `Chatting with ${selectedUser}` : "Select a user"}
            </h2>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: "300px" }}>
            {selectedUser ? (
              messages
                .filter(
                  (msg) =>
                    (msg.sender === username && msg.recipient === selectedUser) ||
                    (msg.sender === selectedUser && msg.recipient === username)
                )
                .map((msg) => (
                  <div
                    key={msg.timestamp}
                    className={`flex ${
                      msg.sender === username ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg shadow-md ${
                        msg.sender === username
                          ? "bg-teal-600 dark:bg-teal-500 text-white"
                          : "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                      }`}
                    >
                      <span className="font-semibold">
                        {msg.sender === username ? "You" : msg.sender}:
                      </span>{" "}
                      <span>{msg.text}</span>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center">
                // Select a coder to start chatting
              </p>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={sendMessage} className="p-4 bg-gray-200 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 flex gap-2 sticky bottom-0">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={selectedUser ? `Message ${selectedUser}` : "Select a user first"}
              className="flex-1 p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
              disabled={!selectedUser}
            />
            <button
              type="submit"
              className="bg-teal-600 dark:bg-teal-500 text-white px-4 py-3 rounded-lg hover:bg-teal-700 dark:hover:bg-teal-400 transition-colors duration-200 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center space-x-2 shadow-md"
              disabled={!selectedUser}
            >
              <Send size={18} />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
