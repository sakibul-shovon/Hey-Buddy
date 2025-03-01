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
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, username } = useContext(AuthContext);

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
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="text-2xl text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              <FaBars />
            </button>
            <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
              Welcome back, {username}!
            </h1>
          </div>
          <input
            type="text"
            placeholder="Search projects, people, or teams..."
            className="w-full max-w-sm p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
          />
        </header>

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
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
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
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
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
          </div>
        </div>

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
            <CalendarHeatmap
              startDate={new Date("2024-01-01")}
              endDate={new Date("2024-12-31")}
              values={heatmapData}
              classForValue={(value) =>
                value ? `color-scale-${value.count}` : "color-empty"
              }
              style={{ width: "100%", maxWidth: "600px", margin: "auto" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;