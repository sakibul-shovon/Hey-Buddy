import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaTimes } from "react-icons/fa";

const EditProfile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    name: "",
    bio: "",
    skills: [],
    title: "",
    githubUrl: "",
    portfolio: "",
    experience: "",
    interests: [],
  });
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const authToken = localStorage.getItem("authToken");
  const fileInputRef = useRef(null);

  const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");
  
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("theme");
    if (savedMode) return savedMode === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark"); // Add dark class to html element
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark"); // Remove dark class from html element
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);
  

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    if (!authToken) {
      setError("User not logged in.");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/api/user/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setUserDetails({
          name: data.name,
          bio: data.bio,
          skills: data.skills || [],
          title: data.title,
          githubUrl: data.githubUrl,
          portfolio: data.portfolio,
          experience: data.experience || "",
          interests: data.interests || [],
        });
        setUploadedImage(data.profilePicture?.url || null);
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Failed to load user details.");
      }
    };
    fetchUserDetails();
  }, [authToken, API_URL]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError("");
      setShowProfileOptions(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("⚠️ Please select an image before uploading.");
      return;
    }
    if (!authToken) {
      setError("⚠️ User not logged in.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const sigResponse = await fetch(`${API_URL}/api/cloudinary-signature`, {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!sigResponse.ok)
        throw new Error("❌ Failed to fetch Cloudinary signature");

      const { timestamp, signature, folder } = await sigResponse.json();
      const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;
      if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY) {
        throw new Error("❌ Cloudinary environment variables are missing");
      }

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("api_key", CLOUDINARY_API_KEY);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", folder);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok)
        throw new Error(
          `❌ Cloudinary Upload Failed: ${uploadData.error?.message}`
        );

      setUploadedImage(uploadData.secure_url);
      await fetch(`${API_URL}/api/user/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          profilePicture: {
            url: uploadData.secure_url,
            publicId: uploadData.public_id,
          },
        }),
      });
      setSelectedFile(null);
      setError("");
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProfilePicture = async () => {
    if (!authToken) {
      setError("⚠️ User not logged in.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/user/profile`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error("Failed to remove profile picture");
      setUploadedImage(null);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to remove profile picture.");
    }
    setShowProfileOptions(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeSkills = (e) => {
    if (e.key === "Enter" && e.target.value) {
      const newSkill = e.target.value.trim();
      setUserDetails((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill],
      }));
      e.target.value = ""; // clear the input field
    }
  };

  const handleChangeInterests = (e) => {
    if (e.key === "Enter" && e.target.value) {
      const newInterest = e.target.value.trim();
      setUserDetails((prev) => ({
        ...prev,
        interests: [...prev.interests, newInterest],
      }));
      e.target.value = ""; // clear the input field
    }
  };

  const handleRemoveItem = (type, index) => {
    setUserDetails((prev) => {
      const updatedList = [...prev[type]];
      updatedList.splice(index, 1);
      return { ...prev, [type]: updatedList };
    });
  };

  const handleSave = async () => {
    if (!authToken) {
      setError("User not logged in.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/user/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(userDetails),
      });
      const data = await response.json();

      if (response.ok) {
        alert("Profile updated successfully!");
        navigate("/dashboard");
      } else {
        setError(data.error || "Failed to update profile.");
      }
    } catch (err) {
      setError("Error updating profile.");
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="max-w-auto mx-auto p-6 space-y-6 dark:bg-gray-900 dark:text-white">
      <h1 className="text-3xl font-semibold text-center">Edit Profile</h1>

      <div className="flex justify-center items-center space-x-4">
        <div className="relative">
          <img
            src={uploadedImage || "/default-profile.png"}
            alt="Profile"
            className="w-64 h-64 rounded-full border-4 border-teal-500 object-cover"
          />
        </div>

        {showProfileOptions && (
          <div className="absolute mt-2 flex space-x-4 bg-white shadow-lg rounded-md p-3">
            <button
              onClick={() => document.getElementById("file-input").click()}
              className="text-teal-600"
            >
              Update Profile Picture
            </button>
            <button onClick={handleRemoveProfilePicture} className="text-red-600">
              Remove Profile Picture
            </button>
          </div>
        )}

        <input
          type="file"
          id="file-input"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      <div className="mx-auto max-w-4xl space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="name" className="font-semibold">Name:</label>
          <input
            id="name"
            name="name"
            type="text"
            value={userDetails.name}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="bio" className="font-semibold">Bio:</label>
          <textarea
            id="bio"
            name="bio"
            value={userDetails.bio}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="title" className="font-semibold">Title:</label>
          <input
            id="title"
            name="title"
            type="text"
            value={userDetails.title}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="experience" className="font-semibold">Experience:</label>
          <input
            id="experience"
            name="experience"
            type="text"
            value={userDetails.experience}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="skills" className="font-semibold">Skills:</label>
          <input
            id="skills"
            name="skills"
            type="text"
            onKeyDown={handleChangeSkills}
            className="p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {userDetails.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-teal-200 rounded-full text-teal-600 flex items-center"
              >
                {skill}
                <FaTimes
                  className="ml-2 cursor-pointer"
                  onClick={() => handleRemoveItem("skills", index)}
                />
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="interests" className="font-semibold">Interests:</label>
          <input
            id="interests"
            name="interests"
            type="text"
            onKeyDown={handleChangeInterests}
            className="p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {userDetails.interests.map((interest, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-teal-200 rounded-full text-teal-600 flex items-center"
              >
                {interest}
                <FaTimes
                  className="ml-2 cursor-pointer"
                  onClick={() => handleRemoveItem("interests", index)}
                />
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="githubUrl" className="font-semibold">GitHub URL:</label>
          <input
            id="githubUrl"
            name="githubUrl"
            type="url"
            value={userDetails.githubUrl}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="portfolio" className="font-semibold">Portfolio URL:</label>
          <input
            id="portfolio"
            name="portfolio"
            type="url"
            value={userDetails.portfolio}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>

        {error && <div className="text-red-600 text-center">{error}</div>}
      </div>
    </div>
  );
};

export default EditProfile;
