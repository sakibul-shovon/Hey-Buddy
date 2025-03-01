import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { AuthContext } from "../context/AuthContext";
import { Edit, Trash2, Eye, Send, User, ChevronDown } from "lucide-react";

const socket = io("http://localhost:5000"); // Ensure this matches your backend port

const Chat = () => {
  const { username } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    socket.emit("join", username);

    socket.on("userList", (userList) => {
      console.log("Received userList:", userList);
      setUsers(userList.filter((u) => u !== username));
    });

    socket.on("messageHistory", (history) => {
      setMessages(history);
    });

    socket.on("privateMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (msg.recipient === username) {
        socket.emit("markAsSeen", msg.id);
      }
    });

    socket.on("messageSeen", (messageId) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, seen: true } : msg))
      );
    });

    socket.on("messageUnsent", (messageId) => {
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    });

    socket.on("messageEdited", (updatedMessage) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg))
      );
    });

    socket.on("messageDeleted", (messageId) => {
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    });

    return () => {
      socket.off("userList");
      socket.off("messageHistory");
      socket.off("privateMessage");
      socket.off("messageSeen");
      socket.off("messageUnsent");
      socket.off("messageEdited");
      socket.off("messageDeleted");
    };
  }, [username]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && selectedUser) {
      socket.emit("sendPrivateMessage", {
        recipient: selectedUser,
        text: message,
      });
      setMessage("");
    }
  };

  const unsendMessage = (messageId) => {
    socket.emit("unsendMessage", messageId);
  };

  const editMessage = (messageId, currentText) => {
    setEditingMessageId(messageId);
    setEditText(currentText);
  };

  const saveEditedMessage = (e) => {
    e.preventDefault();
    if (editText.trim() && editingMessageId) {
      socket.emit("editMessage", { messageId: editingMessageId, newText: editText });
      setEditingMessageId(null);
      setEditText("");
    }
  };

  const deleteMessage = (messageId) => {
    socket.emit("deleteMessage", messageId);
  };

  return (
    <div className="container mx-auto max-w-5xl px-6 py-8 h-screen flex flex-col font-mono bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-teal-600 dark:text-teal-400 tracking-tight">
        // Private Chat Terminal
      </h1>
      <div className="flex flex-1 gap-6">
        {/* User List */}
        <div className="w-1/3 bg-gray-200 dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-300 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center space-x-2">
            <User size={20} className="text-green-500 dark:text-green-400" />
            <span>Online Coders</span>
          </h2>
          <ul className="space-y-3">
            {users.map((user) => (
              <li
                key={user}
                onClick={() => setSelectedUser(user)}
                className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedUser === user
                    ? "bg-teal-100 dark:bg-teal-700 text-teal-800 dark:text-teal-200 shadow-md"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 hover:text-teal-600 dark:hover:text-teal-400"
                }`}
              >
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>{user}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Chat Area */}
        <div className="w-2/3 flex flex-col bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg border border-gray-300 dark:border-gray-700">
          <div className="p-4 bg-gray-300 dark:bg-gray-700 rounded-t-xl flex items-center space-x-2">
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {selectedUser ? `> Chatting with ${selectedUser}` : "> Select a user"}
            </span>
            {selectedUser && <ChevronDown size={20} className="text-gray-600 dark:text-gray-400" />}
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {selectedUser ? (
              messages
                .filter(
                  (msg) =>
                    (msg.sender === username && msg.recipient === selectedUser) ||
                    (msg.sender === selectedUser && msg.recipient === username)
                )
                .map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-4 flex ${
                      msg.sender === username ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg shadow-md transition-all duration-200 ${
                        msg.sender === username
                          ? "bg-teal-600 dark:bg-teal-500 text-white"
                          : "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                      }`}
                    >
                      {editingMessageId === msg.id ? (
                        <form onSubmit={saveEditedMessage} className="flex gap-2">
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="flex-1 p-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                          />
                          <button
                            type="submit"
                            className="text-teal-200 hover:text-teal-300 transition-colors"
                          >
                            Save
                          </button>
                        </form>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-semibold">
                              {msg.user === username ? "You" : msg.user}:
                            </span>{" "}
                            <span>{msg.text}</span>
                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              {msg.timestamp} {msg.seen && msg.sender === username ? "(Seen)" : ""}
                            </div>
                          </div>
                          {msg.sender === username && (
                            <div className="flex space-x-2 ml-2">
                              <button
                                onClick={() => editMessage(msg.id, msg.text)}
                                className="text-gray-200 dark:text-gray-400 hover:text-teal-300 dark:hover:text-teal-200 transition-colors"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => deleteMessage(msg.id)}
                                className="text-gray-200 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                              <button
                                onClick={() => unsendMessage(msg.id)}
                                className="text-gray-200 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
                              >
                                <Eye size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center mt-10">
                // Select a coder to start chatting
              </p>
            )}
          </div>
          <form onSubmit={sendMessage} className="p-4 bg-gray-200 dark:bg-gray-800 rounded-b-xl flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                selectedUser
                  ? `> ${selectedUser}: `
                  : "// Select a user first"
              }
              className="flex-1 p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
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