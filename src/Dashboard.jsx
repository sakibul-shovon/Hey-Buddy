import React, { useState } from "react";
import { FaTrophy, FaUsers, FaProjectDiagram, FaCalendarAlt, FaCog, FaQuestionCircle, FaComments, FaBars, FaTimes } from "react-icons/fa";
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

const Dashboard = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const heatmapData = [
    { date: '2024-02-01', count: 2 },
    { date: '2024-02-05', count: 4 },
    { date: '2024-02-10', count: 8 },
    { date: '2024-02-15', count: 3 },
    { date: '2024-02-20', count: 7 },
  ];

  return (
    <div className="flex h-screen bg-gray-50 transition-all duration-300">
      {/* Sidebar Drawer */}
      
      {/* Main Content */}
      <div className={`flex-1 p-10 transition-all duration-300 ${isDrawerOpen ? "ml-64" : "ml-0"}`}>
        <header className="flex justify-between items-center mb-6">
          <button onClick={() => setIsDrawerOpen(!isDrawerOpen)} className="text-2xl text-gray-700"><FaBars /></button>
          <input type="text" placeholder="Search projects, people, or teams..." className="border p-2 w-full max-w-md rounded-lg shadow-sm" />
        </header>
        
        <h1 className="text-4xl font-extrabold text-gray-900">Welcome back!</h1>
        <p className="text-gray-500 mb-6">Here's what's happening in your Hey Buddy network</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="p-4 bg-white shadow-md rounded-lg border border-gray-200 text-center">
            <h3 className="text-lg font-semibold">Active Projects</h3>
            <p className="text-2xl font-bold text-blue-600">12</p>
            <p className="text-gray-500 text-sm">+2 projects this month</p>
          </div>
          <div className="p-4 bg-white shadow-md rounded-lg border border-gray-200 text-center">
            <h3 className="text-lg font-semibold">Team Members</h3>
            <p className="text-2xl font-bold text-green-600">24</p>
            <p className="text-gray-500 text-sm">+4 new connections</p>
          </div>
          <div className="p-4 bg-white shadow-md rounded-lg border border-gray-200 text-center">
            <h3 className="text-lg font-semibold">Messages</h3>
            <p className="text-2xl font-bold text-red-600">8</p>
            <p className="text-gray-500 text-sm">3 unread messages</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-4 bg-white shadow-md rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold">Upcoming Events</h3>
            <p className="text-gray-600 text-sm">📅 Web Dev Hackathon - This Saturday at 10:00 AM</p>
            <p className="text-gray-600 text-sm">📅 UI/UX Workshop - Next Tuesday at 2:00 PM</p>
          </div>
          <div className="p-4 bg-white shadow-md rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold">Recent Achievements</h3>
            <p className="text-gray-600 text-sm">🏆 Project Master - Completed 5 projects successfully</p>
            <p className="text-gray-600 text-sm">🏆 Team Player - Collaborated with 10 different teams</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
