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
  {
    id: 2,
    title: "Build E-commerce Website with Nagad & bKash Payment",
    category: "Web Development",
    description: "Looking for a developer to create a full-featured e-commerce platform for our electronics store. Must include product catalog, shopping cart, and integration with Nagad and bKash payment gateways.",
    skills: ["React.js", "Node.js", "MongoDB", "Payment API"],
    minBudget: 60000,
    maxBudget: 90000,
    postedBy: "Dhaka Tech Hub",
    rating: 4.9,
    reviewCount: 36,
    deadline: "20 days",
    bids: 12
  },
  {
    id: 3,
    title: "Develop Machine Learning Model for Bangla Text Analysis",
    category: "AI/ML",
    description: "Need an AI expert to develop a sentiment analysis model for Bangla language text from social media. Model should classify customer feedback as positive, negative, or neutral.",
    skills: ["Python", "Machine Learning", "NLP", "Bangla Language Processing"],
    minBudget: 70000,
    maxBudget: 120000,
    postedBy: "Data Insights BD",
    rating: 4.6,
    reviewCount: 18,
    deadline: "25 days",
    bids: 9
  },
  {
    id: 4,
    title: "Design UI/UX for Food Delivery App in Bangladesh",
    category: "UI/UX Design",
    description: "Seeking a talented UI/UX designer to create modern, user-friendly interfaces for our food delivery app targeting the Bangladesh market. Must understand local user preferences.",
    skills: ["UI/UX Design", "Figma", "Mobile App Design", "User Research"],
    minBudget: 40000,
    maxBudget: 70000,
    postedBy: "FoodExpress BD",
    rating: 4.7,
    reviewCount: 29,
    deadline: "15 days",
    bids: 15
  },
  {
    id: 5,
    title: "Setup CI/CD Pipeline for Dhaka-based Startup",
    category: "DevOps",
    description: "Need a DevOps engineer to set up a complete CI/CD pipeline using GitLab CI, Docker, and Kubernetes for our growing tech startup in Dhaka.",
    skills: ["DevOps", "Docker", "Kubernetes", "CI/CD", "GitLab"],
    minBudget: 50000,
    maxBudget: 80000,
    postedBy: "TechNext Bangladesh",
    rating: 4.5,
    reviewCount: 12,
    deadline: "10 days",
    bids: 6
  },
  {
    id: 6,
    title: "Develop Blockchain Solution for Supply Chain Tracking",
    category: "Blockchain",
    description: "Looking for a blockchain developer to create a supply chain tracking solution for garment industry in Bangladesh. Should use Hyperledger Fabric and provide transparent tracking.",
    skills: ["Blockchain", "Hyperledger", "Smart Contracts", "Supply Chain"],
    minBudget: 90000,
    maxBudget: 180000,
    postedBy: "Bangladesh Garments Association",
    rating: 4.3,
    reviewCount: 8,
    deadline: "45 days",
    bids: 4
  },
  {
    id: 7,
    title: "Create Digital Marketing Campaign for Tech Bootcamp",
    category: "Digital Marketing",
    description: "Need a digital marketing expert to create and execute a campaign for our new tech bootcamp in Dhaka. Focus on Facebook, YouTube, and Google Ads targeting young professionals.",
    skills: ["Digital Marketing", "Social Media", "Google Ads", "Analytics"],
    minBudget: 35000,
    maxBudget: 60000,
    postedBy: "CodeCamp Bangladesh",
    rating: 4.8,
    reviewCount: 22,
    deadline: "7 days",
    bids: 19
  },
  {
    id: 8,
    title: "Build Real-time Dashboard for E-commerce Analytics",
    category: "Web Development",
    description: "Need a developer to create a real-time analytics dashboard for our e-commerce platform. Should show sales, user behavior, and inventory metrics with charts and filters.",
    skills: ["JavaScript", "React", "D3.js", "WebSockets", "Data Visualization"],
    minBudget: 45000,
    maxBudget: 75000,
    postedBy: "ShopBD Online",
    rating: 4.6,
    reviewCount: 15,
    deadline: "14 days",
    bids: 10
  },
  {
    id: 9,
    title: "Develop IoT Solution for Smart Agriculture in Bangladesh",
    category: "Other",
    description: "Seeking an IoT developer to create a solution for monitoring soil moisture, temperature, and sunlight for small farms in rural Bangladesh. Must work with low-cost sensors and have low power requirements.",
    skills: ["IoT", "Embedded Systems", "Arduino", "Sensor Integration"],
    minBudget: 65000,
    maxBudget: 110000,
    postedBy: "AgriTech Solutions",
    rating: 4.4,
    reviewCount: 7,
    deadline: "30 days",
    bids: 5
  },
  {
    id: 10,
    title: "Create AR App for Virtual Clothing Try-On",
    category: "Mobile App",
    description: "Looking for AR developer to build a mobile app that allows users to virtually try on traditional Bangladeshi clothing. Should work on both Android and iOS.",
    skills: ["Augmented Reality", "Unity", "ARCore", "ARKit", "3D Modeling"],
    minBudget: 100000,
    maxBudget: 200000,
    postedBy: "Fashion Tech BD",
    rating: 4.9,
    reviewCount: 11,
    deadline: "60 days",
    bids: 3
  }
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