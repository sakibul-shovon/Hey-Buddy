import React, { useState } from "react";
import { UserPlus, X, MessageCircle, Search, Link } from "lucide-react";

const mockUsers = [
  {
    id: 1,
    name: "Tanvir Ahmed",
    title: "Software Engineer",
    experience: "6 years",
    skills: ["React", "JavaScript", "Node.js", "MongoDB"],
    interests: ["Web Development", "AI", "Open Source"],
    lookingFor: ["Collaboration", "Mentorship"],
    githubUrl: "github.com/tanvirahmed",
    portfolio: "tanvir.dev",
    bio: "Love solving complex problems with clean code.",
    image: `https://api.dicebear.com/7.x/pixel-art/svg?seed=TanvirAhmed`,
  },
  // ... (keeping the rest of mockUsers as in original)
];

const FindBuddy = () => {
  const [users, setUsers] = useState(mockUsers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchSkills, setSearchSkills] = useState("");
  const [connections, setConnections] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filterUsers = (searchTerm) => {
    if (!searchTerm.trim()) return mockUsers;
    return mockUsers.filter(
      (user) =>
        user.skills.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        user.interests.some((interest) =>
          interest.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filteredUsers = filterUsers(searchSkills);
    setUsers(filteredUsers);
    setCurrentIndex(0);
  };

  const handleConnect = () => {
    if (currentIndex < users.length) {
      setConnections([...connections, users[currentIndex]]);
      nextProfile();
    }
  };

  const handleSkip = () => nextProfile();

  const nextProfile = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < users.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const currentUser = users[currentIndex];

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Your Buddy</h1>

      {/* Search and Filter Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Search by skills or interests..."
            value={searchSkills}
            onChange={(e) => setSearchSkills(e.target.value)}
            className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center"
          >
            <Search size={20} className="mr-2" />
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          {["all", "developers", "designers", "mentors", "students"].map(
            (filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
                  selectedFilter === filter
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            )
          )}
        </div>
      </div>

      {/* Main Profile Card */}
      {currentUser && (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
          <div className="md:flex">
            <img
              src={currentUser.image}
              alt={currentUser.name}
              className="h-48 w-full md:w-48 object-cover rounded-lg md:rounded-r-none"
            />
            <div className="p-6 flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{currentUser.name}</h2>
                  <p className="text-lg text-gray-600">{currentUser.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  {currentUser.githubUrl && (
                    <a href="#" className="text-gray-600 hover:text-indigo-600">
                      <Link size={20} />
                    </a>
                  )}
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                    {currentUser.experience}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{currentUser.bio}</p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Skills</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentUser.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Interests</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentUser.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Looking For</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentUser.lookingFor.map((item, index) => (
                      <span
                        key={index}
                        className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={handleSkip}
                  className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-200 flex items-center gap-2"
                >
                  <X size={20} />
                  Next
                </button>
                <button
                  onClick={handleConnect}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center gap-2"
                >
                  <UserPlus size={20} />
                  Connect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connections Section */}
      {connections.length > 0 && (
        <div className="max-w-2xl mx-auto mt-8">
          <h3 className="text-xl font-bold mb-4">Your Connections</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {connections.map((connection) => (
              <div
                key={connection.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition duration-200"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={connection.image}
                    alt={connection.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{connection.name}</h4>
                    <p className="text-sm text-gray-600">{connection.title}</p>
                  </div>
                </div>
                <button className="mt-3 w-full bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg hover:bg-indigo-200 transition duration-200 flex items-center justify-center gap-2">
                  <MessageCircle size={16} />
                  Message
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No More Profiles Message */}
      {currentIndex >= users.length && (
        <div className="max-w-2xl mx-auto mt-8 text-center p-8 bg-white rounded-xl shadow">
          <h3 className="text-xl font-bold text-gray-800">No More Profiles</h3>
          <p className="text-gray-600 mt-2">
            Try adjusting your search to see more potential connections
          </p>
        </div>
      )}
    </div>
  );
};

export default FindBuddy;