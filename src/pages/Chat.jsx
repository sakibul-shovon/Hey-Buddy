import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { AuthContext } from "../context/AuthContext";
import { Edit, Trash2, Eye, Send } from "lucide-react";

const socket = io("http://localhost:5000");

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
      console.log("Received userList:", userList); // Debug log
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
    <div className="container mx-auto max-w-4xl px-4 py-8 h-screen flex flex-col">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Private Chat
      </h1>
      <div className="flex flex-1 gap-4">
        <div className="w-1/3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Online Users
          </h2>
          <ul className="space-y-2">
            {users.map((user) => (
              <li
                key={user}
                onClick={() => setSelectedUser(user)}
                className={`p-2 rounded-md cursor-pointer ${
                  selectedUser === user
                    ? "bg-teal-100 dark:bg-teal-700 text-teal-800 dark:text-teal-200"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {user}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-2/3 flex flex-col">
          <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-y-auto">
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
                    className={`mb-2 p-2 rounded-md flex items-center justify-between ${
                      msg.sender === username
                        ? "bg-teal-100 dark:bg-teal-700 text-right"
                        : "bg-gray-100 dark:bg-gray-700 text-left"
                    }`}
                  >
                    {editingMessageId === msg.id ? (
                      <form onSubmit={saveEditedMessage} className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-gray-200 text-gray-900"
                        />
                        <button
                          type="submit"
                          className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300"
                        >
                          Save
                        </button>
                      </form>
                    ) : (
                      <>
                        <div className="flex-1">
                          <span className="font-semibold text-gray-900 dark:text-gray-100">
                            {msg.user}:
                          </span>{" "}
                          <span className="text-gray-800 dark:text-gray-200">
                            {msg.text}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                            {msg.timestamp} {msg.seen && msg.sender === username ? "(Seen)" : ""}
                          </span>
                        </div>
                        {msg.sender === username && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => editMessage(msg.id, msg.text)}
                              className="text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => deleteMessage(msg.id)}
                              className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                            >
                              <Trash2 size={16} />
                            </button>
                            <button
                              onClick={() => unsendMessage(msg.id)}
                              className="text-gray-500 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Select a user to start chatting
              </p>
            )}
          </div>
          <form onSubmit={sendMessage} className="mt-4 flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                selectedUser
                  ? `Message ${selectedUser}...`
                  : "Select a user first"
              }
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-gray-200 text-gray-900 placeholder-gray-400 dark:placeholder-gray-500"
              disabled={!selectedUser}
            />
            <button
              type="submit"
              className="bg-teal-600 dark:bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-700 dark:hover:bg-teal-400 transition-colors duration-200 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center space-x-2"
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