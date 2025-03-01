import React, { useState } from "react";
import { Search, Filter, Plus, Star, MessageCircle, Clock, Tag, Users } from "lucide-react";

const sampleProjects = [
  {
    id: 1,
    title: "Develop Fintech Mobile App with bKash Integration",
    category: "Mobile App",
    description: "We need a skilled mobile developer to create a fintech app...",
    skills: ["React Native", "Mobile Development", "bKash API", "Payment Gateway"],
    minBudget: 80000,
    maxBudget: 150000,
    postedBy: "FinCorp Bangladesh",
    rating: 4.8,
    reviewCount: 24,
    deadline: "30 days",
    bids: 7,
  },
  // ... (keeping the rest of sampleProjects as in original)
];

const MicroProjectsPage = () => {
  const [activeTab, setActiveTab] = useState("browse");
  const [projects, setProjects] = useState(sampleProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Web Development",
    "Mobile App",
    "UI/UX Design",
    "AI/ML",
    "Blockchain",
    "Digital Marketing",
    "DevOps",
    "Other",
  ];

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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Micro Projects</h1>
          <p className="mt-2 text-sm text-gray-500">
            Find quick tasks, collaborate, and grow your skills
          </p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center transition duration-200">
          <Plus size={18} className="mr-2" />
          Post a Project
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {["browse", "my-bids", "my-projects"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 font-medium text-sm ${
                  activeTab === tab
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="relative w-full md:w-1/2">
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

            <div className="flex space-x-4">
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <Filter size={18} className="text-gray-400" />
                </div>
              </div>

              <select className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 shadow-sm">
                <option>Sort by: Newest</option>
                <option>Sort by: Oldest</option>
                <option>Sort by: Budget: High to Low</option>
                <option>Sort by: Budget: Low to High</option>
                <option>Sort by: Deadline</option>
              </select>
            </div>
          </div>

          {activeTab === "browse" && (
            <div className="grid grid-cols-1 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}

          {activeTab === "my-bids" && (
            <div className="text-center py-12">
              <p className="text-gray-500">You haven't placed any bids yet.</p>
              <button className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium">
                Browse projects to get started
              </button>
            </div>
          )}

          {activeTab === "my-projects" && (
            <div className="text-center py-12">
              <p className="text-gray-500">You haven't posted any projects yet.</p>
              <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md inline-flex items-center transition duration-200">
                <Plus size={18} className="mr-2" />
                Post Your First Project
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({ project }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
          <div className="flex items-center mt-1">
            <Tag size={14} className="text-gray-400 mr-1" />
            <span className="text-sm text-gray-500">{project.category}</span>
          </div>
        </div>
        <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
          {project.minBudget} - {project.maxBudget} ৳
        </div>
      </div>

      <p className="mt-3 text-gray-600 text-sm line-clamp-2">{project.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.skills.map((skill, index) => (
          <span
            key={index}
            className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={`/api/placeholder/32/32`}
            alt="Avatar"
            className="w-8 h-8 rounded-full"
          />
          <div className="ml-2">
            <p className="text-sm font-medium text-gray-900">{project.postedBy}</p>
            <div className="flex items-center">
              <Star size={14} className="text-yellow-400" fill="currentColor" />
              <span className="text-xs text-gray-500 ml-1">
                {project.rating} • {project.reviewCount} reviews
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center text-gray-500">
            <Clock size={14} className="mr-1" />
            <span className="text-xs">{project.deadline}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Users size={14} className="mr-1" />
            <span className="text-xs">{project.bids}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex space-x-3">
        <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200">
          Place Bid
        </button>
        <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-200">
          <MessageCircle size={16} className="mr-2" />
          Chat
        </button>
      </div>
    </div>
  );
};

export default MicroProjectsPage;