import React, { useState, useEffect } from "react";
import { Search, Plus, Link, X } from "lucide-react";

const ShowcaseProjectsPage = () => {
  const [activeTab, setActiveTab] = useState("discover");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showPostForm, setShowPostForm] = useState(false);
  const [projects, setProjects] = useState([]);

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

  // Fetch projects from the database
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/projects'); // Update this URL
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        console.error('Failed to fetch projects:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const projectData = {
      title: e.target.title.value,
      category: e.target.category.value,
      description: e.target.description.value,
      link: e.target.link.value,
    };

    try {
      const response = await fetch('http://localhost:8000/api/projects', { // Update this URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        setShowPostForm(false);
        fetchProjects(); // Refresh the project list after submission
      } else {
        console.error('Failed to submit project:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting project:', error);
    }
  };

  // Filter projects based on search and category
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Showcase Projects
        </h1>
        <button
          onClick={() => setShowPostForm(true)}
          className="flex items-center space-x-2 bg-teal-600 dark:bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-700 dark:hover:bg-teal-400 transition-colors duration-200 shadow-md"
        >
          <Plus size={18} />
          <span>Showcase Your Project</span>
        </button>
      </div>

      {showPostForm && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg p-8 relative">
            <button
              onClick={() => setShowPostForm(false)}
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Showcase Your Project
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Project Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-gray-200 text-gray-900 placeholder-gray-400 dark:placeholder-gray-500 transition duration-200"
                  placeholder="Enter your project title"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-gray-200 text-gray-900 placeholder-gray-400 dark:placeholder-gray-500 transition duration-200"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-gray-200 text-gray-900 placeholder-gray-400 dark:placeholder-gray-500 transition duration-200 h-32 resize-y"
                  placeholder="Briefly describe your project"
                  required
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="link"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Project Link
                </label>
                <input
                  type="url"
                  id="link"
                  name="link"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-gray-200 text-gray-900 placeholder-gray-400 dark:placeholder-gray-500 transition duration-200"
                  placeholder="https://yourproject.com"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowPostForm(false)}
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-600 dark:bg-teal-500 text-white rounded-md hover:bg-teal-700 dark:hover:bg-teal-400 transition-colors duration-200 shadow-md"
                >
                  Submit Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="relative w-full md:w-1/2 mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search projects..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-full focus:ring-teal-500 focus:border-teal-500 shadow-sm dark:bg-gray-700 dark:text-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredProjects.map((project) => (
              <li key={project._id} className="p-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {project.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {project.description}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Category: {project.category}
                </p>
                <a
                  href={project.link}
                  className="text-teal-600 dark:text-teal-400 hover:underline flex items-center mt-2"
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