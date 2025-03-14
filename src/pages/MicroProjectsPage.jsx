import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Filter,
  Plus,
  Star,
  MessageCircle,
  Clock,
  Tag,
  Users,
  X,
  Save,
} from "lucide-react";

const MicroProjectsPage = ({ userId }) => {
  const [activeTab, setActiveTab] = useState("browse");
  const [projects, setProjects] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showPostForm, setShowPostForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Web Development",
    description: "",
    skills: "",
    minBudget: "",
    maxBudget: "",
    deadline: "7",
  });

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

  // Fetch projects with error handling
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsRes, myProjectsRes, myBidsRes] = await Promise.all([
          axios.get("http://localhost:8000/api/microprojects"),
          userId
            ? axios.get(`http://localhost:8000/api/my-microprojects/${userId}`)
            : null,
          userId
            ? axios.get(`http://localhost:8000/api/my-bids/${userId}`)
            : null,
        ]);

        setProjects(Array.isArray(projectsRes?.data) ? projectsRes.data : []);
        if (myProjectsRes) {
          setMyProjects(
            Array.isArray(myProjectsRes?.data) ? myProjectsRes.data : []
          );
        }
        if (myBidsRes) {
          setMyBids(Array.isArray(myBidsRes?.data) ? myBidsRes.data : []);
        }
      } catch (err) {
        setError("Failed to load projects. Please try again later.");
        console.error("Fetch error:", err);
        setProjects([]);
        setMyProjects([]);
        setMyBids([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Handle project posting
  const handlePostProject = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/microprojects",
        {
          ...formData,
          skills: formData.skills.split(",").map((skill) => skill.trim()),
          postedBy: userId,
        }
      );

      if (response.data) {
        setProjects((prev) => [response.data, ...prev]);
        setShowPostForm(false);
        setFormData({
          title: "",
          category: "Web Development",
          description: "",
          skills: "",
          minBudget: "",
          maxBudget: "",
          deadline: "7",
        });
      }
    } catch (err) {
      console.error("Post error:", err);
      alert("Failed to post project. Please check all fields.");
    }
  };

  // Handle bidding
  const handleBid = async (projectId) => {
    const amount = prompt("Enter your bid amount:");
    if (amount) {
      try {
        await axios.post(
          `http://localhost:8000/api/microprojects/${projectId}/bid`,
          {
            bidder: userId,
            amount: Number(amount),
          }
        );
        // Refresh projects after placing bid
        const response = await axios.get(
          "http://localhost:8000/api/microprojects"
        );
        setProjects(response.data);
      } catch (error) {
        console.error("Bid failed:", error);
        alert("Failed to place bid");
      }
    }
  };

  // Safe filtering with array checks
  const filteredProjects = Array.isArray(projects)
    ? projects.filter((project) => {
        const matchesSearch =
          project?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project?.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === "All" || project?.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
    : [];

  const myUploadedProjects = myProjects.filter((project) => project.postedBy === userId);

  // Loading and error states
  if (loading) {
    return <div className="text-center py-8">Loading projects...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Micro Projects</h1>
          <p className="mt-2 text-sm text-gray-500">
            Find quick tasks, collaborate, and grow your skills
          </p>
        </div>
        <button
          onClick={() => setShowPostForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-2" /> Post a Project
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <button
          onClick={() => setActiveTab("browse")}
          className={`px-4 py-2 ${
            activeTab === "browse"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-700"
          } rounded-md mr-2`}
        >
          Browse
        </button>
        <button
          onClick={() => setActiveTab("myBids")}
          className={`px-4 py-2 ${
            activeTab === "myBids"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-700"
          } rounded-md mr-2`}
        >
          My Bids
        </button>
        <button
          onClick={() => setActiveTab("myProjects")}
          className={`px-4 py-2 ${
            activeTab === "myProjects"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-700"
          } rounded-md`}
        >
          My Projects
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              className="pl-10 pr-4 py-2 border rounded-md w-full text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="border rounded-md px-3 py-2 text-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span>Sort by:</span>
          <select className="border rounded-md px-3 py-2">
            <option>Network</option>
            <option>Newest</option>
            <option>Budget</option>
          </select>
        </div>
      </div>

      {/* Post Project Form */}
      {showPostForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Post New Project</h2>
              <button onClick={() => setShowPostForm(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handlePostProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.slice(1).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Skills (comma separated)</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border rounded"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Min Budget (৳)</label>
                  <input
                    type="number"
                    required
                    className="w-full p-2 border rounded"
                    value={formData.minBudget}
                    onChange={(e) => setFormData({ ...formData, minBudget: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Budget (৳)</label>
                  <input
                    type="number"
                    required
                    className="w-full p-2 border rounded"
                    value={formData.maxBudget}
                    onChange={(e) => setFormData({ ...formData, maxBudget: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  required
                  rows={4}
                  className="w-full p-2 border rounded"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Deadline (days)</label>
                <input
                  type="number"
                  required
                  className="w-full p-2 border rounded"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>

              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center">
                <Save className="mr-2" size={18} /> Post Project
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Project List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project._id}
            className="border-b border-gray-200 py-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {project.title}
                </h3>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {project.category}
                  </span>
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-600">
                    {project.rating} - {project.reviews} reviews
                  </span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="mt-4 text-gray-600 text-sm">{project.description}</p>

            <div className="mt-4 flex gap-2 flex-wrap">
              {project.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{project.budget}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{project.deadline}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">
                  {project.applicants} applicants
                </span>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="flex gap-2">
                <button
                  onClick={() => handleBid(project._id)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm"
                >
                  Plan Bid
                </button>
                {/* <button className="border border-gray-300 px-4 py-2 rounded-md text-sm">
                  Chat
                </button> */}
              </div>
              <span className="text-sm text-gray-500">{project.company}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && activeTab === "browse" && filteredProjects.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No projects found matching your criteria
        </div>
      )}
    </div>
  );
};

export default MicroProjectsPage;