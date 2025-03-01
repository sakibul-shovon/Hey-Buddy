import React, { useState } from "react";
import { Search, Plus, Link, X } from "lucide-react";

const ShowcaseProjectsPage = () => {
  const [activeTab, setActiveTab] = useState("discover");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showPostForm, setShowPostForm] = useState(false);

  const categories = [
    "All",
    "Web Development",
    "Mobile App",
    "UI/UX Design",
    "AI/ML",
    "Game Development",
    "Open Source",
    "Other",
  ];

  const sampleProjects = [
    {
      id: 1,
      title: "Project Alpha",
      category: "Web Development",
      description: "A modern web project with full-stack capabilities.",
      link: "https://projectalpha.com",
      username: "johndoe",
    },
    {
      id: 2,
      title: "AI Research",
      category: "AI/ML",
      description: "Cutting-edge research in artificial intelligence.",
      link: "https://airesearchhub.com",
      username: "janesmith",
    },
  ];

  const filteredProjects = sampleProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Showcase Projects</h1>
        <button
          onClick={() => setShowPostForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center transition duration-200"
        >
          <Plus size={18} className="mr-2" />
          Showcase Your Project
        </button>
      </div>

      {showPostForm && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setShowPostForm(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold mb-4">Post Your Project</h2>
            <input
              type="text"
              placeholder="Project Title"
              className="w-full mb-2 p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <textarea
              placeholder="Project Description"
              className="w-full mb-2 p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
            <input
              type="text"
              placeholder="Project Link"
              className="w-full mb-4 p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              onClick={() => setShowPostForm(false)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md w-full transition duration-200"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="relative w-full md:w-1/2 mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search projects..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <ul className="divide-y divide-gray-200">
            {filteredProjects.map((project) => (
              <li key={project.id} className="p-4">
                <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
                <p className="text-gray-700 mt-1">{project.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Created by: {project.username}
                </p>
                <a
                  href={project.link}
                  className="text-indigo-600 hover:underline flex items-center mt-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Link size={16} className="mr-1" /> Visit Project
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ShowcaseProjectsPage;