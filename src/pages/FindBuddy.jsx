import React, { useState, useEffect, useContext } from "react";
import { UserPlus, X, MessageCircle, Search, Link } from "lucide-react";
import { AuthContext } from "../context/AuthContext"; // Import your AuthContext

const FindBuddy = () => {
  const { isAuthenticated, userId } = useContext(AuthContext); // Get userId from context
  const [users, setUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchSkills, setSearchSkills] = useState("");
  const [connections, setConnections] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");
  const authToken = localStorage.getItem("authToken");



  useEffect(() => {
    if (isAuthenticated) {
      const fetchUsers = async () => {
        try {
          const response = await fetch(`${API_URL}/api/users`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          });
          const data = await response.json();

          // Filter out the current user using userId from the context
          const filteredData = data.filter(user => user._id !== userId && user.email !== localStorage.getItem("username"));
          setUsers(filteredData);
          setDisplayedUsers(filteredData); // Initialize displayed users without the current user
        } catch (err) {
          console.error("Error fetching users:", err);
        }
      };

      fetchUsers();
    }
  }, [authToken, userId, isAuthenticated, API_URL]);

  const filterUsers = (searchTerm) => {
    if (!searchTerm.trim()) return users;
    return users.filter(
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
    setDisplayedUsers(filteredUsers);
    setCurrentIndex(0); // Reset to the first user after filtering
  };

  const handleConnect = async () => {
    if (currentIndex < displayedUsers.length) {
      const friendId = displayedUsers[currentIndex]._id;
  
      // Get the current user's ID (the one pressing the connect button)
      const currentUserId = userId; // Assuming userId comes from AuthContext
  
      try {
        // Add the current user to the selected user's friend list
        const response1 = await fetch(`${API_URL}/api/user/add-friend/${friendId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ friendId: currentUserId }),
        });
  
        if (response1.ok) {
          console.log("Friend added to selected user");
  
          // Add the selected user to the current user's friend list
          const response2 = await fetch(`${API_URL}/api/user/add-friend/${currentUserId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ friendId: friendId }),
          });
  
          if (response2.ok) {
            console.log("Selected user added to current user's friends");
            setConnections([...connections, displayedUsers[currentIndex]]);
            nextProfile(); // Move to the next profile after successful connection
          } else {
            console.error("Error adding friend to current user's friends list");
          }
        } else {
          console.error("Error adding friend to selected user's friends list");
        }
      } catch (err) {
        console.error("Error during connection:", err);
      }
    }
  };
  

  const addFriend = async (friendId) => {
    try {
      const response = await fetch("/api/user/add-friend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ friendId }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(data.message);
      } else {
        console.error("Error adding friend:", data.error);
      }
    } catch (err) {
      console.error("Error adding friend:", err);
    }
  };

  const handleSkip = () => nextProfile();

  const nextProfile = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < displayedUsers.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setCurrentIndex(0); // Reset to the first user after filter change

    if (filter === "all") {
      setDisplayedUsers(users); // Show all users
    } else {
      const filteredUsers = users.filter((user) => user.title.toLowerCase().includes(filter));
      setDisplayedUsers(filteredUsers); // Filter based on title
    }
  };

  const getProfilePictureUrl = (profilePicture) => {
    // If profilePicture exists and has a URL
    if (profilePicture && profilePicture.url) {
      return profilePicture.url; // Return the URL from ProfilePictures collection
    }
    return "/default-profile.png"; // Default image if no profile picture is found
  };

  const currentUser = displayedUsers[currentIndex];

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Find Your Buddy</h1>

      {/* Search and Filter Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Search by skills or interests..."
            value={searchSkills}
            onChange={(e) => setSearchSkills(e.target.value)}
            className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center"
          >
            <Search size={20} className="mr-2" />
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-2 justify-center">
          {["all", "developers", "designers", "mentors", "students"].map(
            (filter) => (
              <button
                key={filter}
                onClick={() => handleFilterChange(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
                  selectedFilter === filter
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-indigo-600"
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
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="md:flex">
            <div className="md:w-48 w-full flex justify-center items-center mb-4 md:mb-0">
              <img
                src={getProfilePictureUrl(currentUser.profilePictureId)}
                alt={currentUser.name}
                className="h-48 w-48 object-cover rounded-full border-2 border-indigo-600"
              />
            </div>
            <div className="p-6 flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{currentUser.name}</h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300">{currentUser.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  {currentUser.githubUrl && (
                    <a
                      href={currentUser.githubUrl}
                      className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
                    >
                      <Link size={20} />
                    </a>
                  )}
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm dark:bg-indigo-600 dark:text-indigo-100">
                    {currentUser.experience}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4">{currentUser.bio}</p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold dark:text-gray-100">Skills</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(currentUser.skills || []).map((skill, index) => (
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
                  <h3 className="text-lg font-semibold dark:text-gray-100">Interests</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(currentUser.interests || []).map((interest, index) => (
                      <span
                        key={index}
                        className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={handleSkip}
                  className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-200 flex items-center gap-2 dark:bg-gray-700 dark:text-white"
                >
                  <X size={20} />
                  Next
                </button>
                <button
                  onClick={handleConnect}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center gap-2 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  <UserPlus size={20} />
                  Connect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No More Profiles Message */}
      {currentIndex >= displayedUsers.length && (
        <div className="max-w-2xl mx-auto mt-8 text-center p-8 bg-white rounded-xl shadow dark:bg-gray-800">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">No More Profiles</h3>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Try adjusting your search to see more potential connections
          </p>
        </div>
      )}
    </div>
  );
};

export default FindBuddy;
