import React, { useState, useContext } from "react";
import {
  FaTrophy,
  FaUsers,
  FaProjectDiagram,
  FaCalendarAlt,
  FaCog,
  FaQuestionCircle,
  FaComments,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Ensure correct path

const Dashboard = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext); // Access logout from context

  const heatmapData = [
    { date: "2024-02-01", count: 2 },
    { date: "2024-02-05", count: 4 },
    { date: "2024-02-10", count: 8 },
    { date: "2024-02-15", count: 3 },
    { date: "2024-02-20", count: 7 },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50 transition-all duration-300 dark:bg-gray-900">
      {/* Sidebar Drawer */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 bg-white dark:bg-gray-800 shadow-xl transition-transform duration-300 p-6 z-50`}
      >
        <button
          onClick={() => setIsDrawerOpen(false)}
          className="mb-6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 text-lg"
        >
          <FaTimes />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Hey Buddy
        </h2>
        <ul className="space-y-4">
          <li className="flex items-center space-x-2 cursor-pointer text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
            <FaProjectDiagram /> <span>Dashboard</span>
          </li>
          <li
            onClick={() => navigate("/find_buddy")}
            className="flex items-center space-x-2 cursor-pointer text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
          >
            <FaUsers /> <span>Find Buddies</span>
          </li>
          <li
            onClick={() => navigate("/micro_project")}
            className="flex items-center space-x-2 cursor-pointer text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
          >
            <FaUsers /> <span>MicroProjects</span>
          </li>
          <li
            onClick={() => navigate("/show_case")}
            className="flex items-center space-x-2 cursor-pointer text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
          >
            <FaUsers /> <span>Showcase Projects</span>
          </li>
          <li className="flex items-center space-x-2 cursor-pointer text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
            <FaComments /> <span>Chat</span>
          </li>
          <li className="flex items-center space-x-2 cursor-pointer text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
            <FaCalendarAlt /> <span>Events</span>
          </li>
          <li className="flex items-center space-x-2 cursor-pointer text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
            <FaTrophy /> <span>Achievements</span>
          </li>
          <li className="flex items-center space-x-2 cursor-pointer text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
            <FaQuestionCircle /> <span>Help</span>
          </li>
          <li className="flex items-center space-x-2 cursor-pointer text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
            <FaCog /> <span>Settings</span>
          </li>
          <li
            onClick={handleLogout}
            className="flex items-center space-x-2 cursor-pointer text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
          >
            <FaCog /> <span>Logout</span>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 p-10 transition-all duration-300 ${
          isDrawerOpen ? "ml-64" : "ml-0"
        }`}
      >
        <header className="flex justify-between items-center mb-6">
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="text-2xl text-gray-700 dark:text-gray-300"
          >
            <FaBars />
          </button>
          <input
            type="text"
            placeholder="Search projects, people, or teams..."
            className="border p-2 w-full max-w-md rounded-lg shadow-sm dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          />
        </header>

        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
          Welcome back!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Here's what's happening in your Hey Buddy network
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700 text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Active Projects
            </h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              12
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              +2 projects this month
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700 text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Team Members
            </h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              24
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              +4 new connections
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700 text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Messages
            </h3>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              8
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              3 unread messages
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Upcoming Events
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              📅 Web Dev Hackathon - This Saturday at 10:00 AM
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              📅 UI/UX Workshop - Next Tuesday at 2:00 PM
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Recent Achievements
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              🏆 Project Master - Completed 5 projects successfully
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              🏆 Team Player - Collaborated with 10 different teams
            </p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-900 dark:text-gray-100">
            Activity Heatmap
          </h3>
          <div className="overflow-x-auto flex justify-center">
            <CalendarHeatmap
              startDate={new Date("2024-01-01")}
              endDate={new Date("2024-12-31")}
              values={heatmapData}
              classForValue={(value) =>
                value ? `color-scale-${value.count}` : "color-empty"
              }
              style={{ width: "100%", maxWidth: "500px", margin: "auto" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;