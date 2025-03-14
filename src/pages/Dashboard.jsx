import React, { useState, useRef, useEffect, useContext } from "react";
import {
  FaHome,
  FaTrophy,
  FaUsers,
  FaProjectDiagram,
  FaCalendarAlt,
  FaCog,
  FaQuestionCircle,
  FaComments,
  FaBars,
  FaTimes,
  FaCamera,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import FriendListModal from "../components/FriendListModal"; // Import the FriendListModal component

const Dashboard = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("theme");
    if (savedMode) return savedMode === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const { connections } = useContext(AuthContext); // Assuming connections are stored in AuthContext
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { logout, username } = useContext(AuthContext);
  // Remove trailing slash to avoid double slashes in API endpoints
  const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");
  const authToken = localStorage.getItem("authToken");

  const heatmapData = [
    { date: "2024-02-01", count: 2 },
    { date: "2024-02-05", count: 4 },
    { date: "2024-02-10", count: 8 },
    { date: "2024-02-15", count: 3 },
    { date: "2024-02-20", count: 7 },
  ];

  // Fetch Profile Picture on Load
  useEffect(() => {
    if (!authToken) {
      setError("User not logged in.");
      return;
    }
    const fetchProfilePicture = async () => {
      try {
        const response = await fetch(`${API_URL}/api/user/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        // Check if response is OK before parsing JSON
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        //console.log("Profile Data:", data);
        if (data?.profilePicture?.url) {
          setUploadedImage(data.profilePicture.url);
        } else {
          setUploadedImage(null);
        }
      } catch (err) {
        console.error("Error fetching profile picture:", err);
        setError("Failed to load profile picture.");
      }
    };
    fetchProfilePicture();
  }, [authToken, API_URL]);

  // Update dark mode on document root and persist preference
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Handle File Selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError("");
      setShowProfileOptions(false);
    }
  };

  // Handle Profile Picture Upload
  const handleUpload = async () => {
    if (!selectedFile) {
      setError("⚠️ Please select an image before uploading.");
      return;
    }
    if (!authToken) {
      setError("⚠️ User not logged in.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const sigResponse = await fetch(`${API_URL}/api/cloudinary-signature`, {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!sigResponse.ok)
        throw new Error("❌ Failed to fetch Cloudinary signature");
      const { timestamp, signature, folder } = await sigResponse.json();
      const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;
      if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY) {
        throw new Error("❌ Cloudinary environment variables are missing");
      }
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("api_key", CLOUDINARY_API_KEY);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", folder);
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok)
        throw new Error(
          `❌ Cloudinary Upload Failed: ${uploadData.error?.message}`
        );
      setUploadedImage(uploadData.secure_url);
      await fetch(`${API_URL}/api/user/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          profilePicture: {
            url: uploadData.secure_url,
            publicId: uploadData.public_id,
          },
        }),
      });
      setSelectedFile(null);
      setError("");
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Remove Profile Picture
  const handleRemoveProfilePicture = async () => {
    if (!authToken) {
      setError("⚠️ User not logged in.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/user/profile`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error("Failed to remove profile picture");
      setUploadedImage(null);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to remove profile picture.");
    }
    setShowProfileOptions(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 flex">
      {/* Sidebar Drawer */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        } w-72 bg-gray-800 dark:bg-gray-900 text-white shadow-2xl transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Hey Buddy</h2>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>
          <ul className="space-y-4 flex-1">
            <li
              onClick={() => navigate("/")}
              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded-md transition-colors"
            >
              <FaHome className="text-teal-400" />
              <span>Home</span>
            </li>
            <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded-md transition-colors">
              <FaProjectDiagram className="text-teal-400" />
              <span>Dashboard</span>
            </li>
            <li
              onClick={() => navigate("/find_buddy")}
              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded-md transition-colors"
            >
              <FaUsers className="text-teal-400" />
              <span>Find Buddies</span>
            </li>
            <li
              onClick={() => navigate("/micro_project")}
              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded-md transition-colors"
            >
              <FaUsers className="text-teal-400" />
              <span>Micro Projects</span>
            </li>
            <li
              onClick={() => navigate("/show_case")}
              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded-md transition-colors"
            >
              <FaUsers className="text-teal-400" />
              <span>Showcase Projects</span>
            </li>
            <li
              onClick={() => navigate("/chat")}
              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded-md transition-colors"
            >
              <FaComments className="text-teal-400" />
              <span>Chat</span>
            </li>
            <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded-md transition-colors">
              <FaCalendarAlt className="text-teal-400" />
              <span>Events</span>
            </li>
            <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded-md transition-colors">
              <FaTrophy className="text-teal-400" />
              <span>Achievements</span>
            </li>
            <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded-md transition-colors">
              <FaQuestionCircle className="text-teal-400" />
              <span>Help</span>
            </li>
            <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded-md transition-colors">
              <FaCog className="text-teal-400" />
              <span>Settings</span>
            </li>
          </ul>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 cursor-pointer bg-red-600 hover:bg-red-700 p-2 rounded-md transition-colors mt-4"
          >
            <FaCog />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 p-8 transition-all duration-300 ${
          isDrawerOpen ? "ml-72" : "ml-0"
        }`}
      >
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="text-2xl text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              <FaBars />
            </button>
            <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
              Welcome back, {username && username.split("@")[0]}!
            </h1>
          </div>
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search projects, people, or teams..."
              className="w-full max-w-2xl p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
            />
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
          </div>
        </header>

        {/* Profile Picture Section */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            {uploadedImage ? (
              <img
                src={uploadedImage}
                alt="Profile"
                className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-4 border-teal-500 shadow-md"
              />
            ) : (
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gray-200 flex items-center justify-center border-4 border-teal-500 shadow-md">
                <span className="text-gray-500 text-xl">No Image</span>
              </div>
            )}
            <div className="absolute bottom-3 right-3">
              <button
                onClick={() => setShowProfileOptions(!showProfileOptions)}
                className="bg-teal-500 p-3 rounded-full cursor-pointer hover:bg-teal-600 transition"
              >
                <FaCamera className="text-white text-lg" />
              </button>
            </div>
            {showProfileOptions && (
              <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-md p-2 flex flex-col space-y-2">
                <button
                  onClick={() => {
                    setShowProfileOptions(false);
                    fileInputRef.current.click();
                  }}
                  className="text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded"
                >
                  Update Profile Picture
                </button>
                <button
                  onClick={handleRemoveProfilePicture}
                  className="text-red-600 hover:bg-red-100 dark:hover:bg-red-700 hover:text-white p-2 rounded"
                >
                  Remove Profile Picture
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          {selectedFile && (
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
              <button
                onClick={() => setSelectedFile(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          )}
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
        <div className="mt-4">
    <button
      onClick={() => navigate("/edit-profile")}  // Redirect to the Edit Profile page
      className="mb-5 px-6 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition"
    >
      Edit Profile
    </button>
  </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  Active Projects
                </h3>
                <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                  12
                </p>
              </div>
              <FaProjectDiagram className="text-teal-500 dark:text-teal-400 text-3xl" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              +2 projects this month
            </p>
          </div>
          <div
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => navigate("/find_buddy")} // Navigate to /find_buddy on click
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  Team Members
                </h3>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  24
                </p>
              </div>
              <FaUsers className="text-green-500 dark:text-green-400 text-3xl" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              +4 new connections
            </p>
          </div>
          <button
            onClick={() => navigate("/chat")}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  Messages
                </h3>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                  8
                </p>
              </div>
              <FaComments className="text-red-500 dark:text-red-400 text-3xl" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              3 unread messages
            </p>
          </button>
        </div>

        {/* Render the FriendListModal */}
        <FriendListModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          friends={connections} // Pass the connections as friends
        />

        {/* Events & Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Upcoming Events
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                <FaCalendarAlt className="text-teal-500" />
                <span>Web Dev Hackathon - Sat, 10:00 AM</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                <FaCalendarAlt className="text-teal-500" />
                <span>UI/UX Workshop - Tue, 2:00 PM</span>
              </li>
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Recent Achievements
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                <FaTrophy className="text-yellow-500" />
                <span>Project Master - 5 projects completed</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                <FaTrophy className="text-yellow-500" />
                <span>Team Player - 10 team collabs</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Heatmap */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 text-center">
            Activity Heatmap
          </h3>
          <div className="overflow-x-auto p-6 flex justify-center">
            <div className="w-full max-w-3xl">
              <CalendarHeatmap
                startDate={new Date("2024-01-01")}
                endDate={new Date("2024-12-31")}
                values={heatmapData}
                classForValue={(value) =>
                  value ? `color-scale-${value.count}` : "color-empty"
                }
                style={{ width: "100%", margin: "auto" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
