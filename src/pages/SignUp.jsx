import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Signup() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(""); // Add username field
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  async function submit(e) {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    if (!email || !password || !username) {
      setErrorMessage("⚠️ All fields are required!");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/signup`, { email, username, password });

      console.log("✅ Server Response:", res.data);

      if (res.data === "exist") {
        setErrorMessage("⚠️ User already exists. Try logging in.");
      } else if (res.data === "notexist") {
        login("dummy-token", username); // Pass username to context
        alert("✅ Signup successful!");
        navigate("/dashboard");
      } else {
        setErrorMessage("❌ Unexpected response: " + res.data);
      }
    } catch (error) {
      console.error("❌ Signup Error:", error);
      setErrorMessage("⚠️ Server error. Please try again.");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF2F2] via-[#A9B5DF] to-[#7886C7] p-6">
      <div className="relative w-full max-w-md bg-white bg-opacity-10 backdrop-blur-xl rounded-xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-center text-white mb-8 drop-shadow-lg">
          Create an Account 🚀
        </h1>

        {errorMessage && (
          <p className="text-[#D9534F] text-sm text-center bg-[#FFF2F2] p-2 rounded-lg mb-4 shadow-lg">
            {errorMessage}
          </p>
        )}

        <form onSubmit={submit} className="space-y-5">
          <div className="relative">
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 bg-[#A9B5DF] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white shadow-lg placeholder-white transition duration-300 ease-in-out"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <input
              type="text"
              id="username"
              className="w-full px-4 py-3 bg-[#A9B5DF] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white shadow-lg placeholder-white transition duration-300 ease-in-out"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 bg-[#2D336B] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white shadow-lg placeholder-white transition duration-300 ease-in-out"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#2D336B] to-[#7886C7] hover:from-[#7886C7] hover:to-[#A9B5DF] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-xl transform hover:scale-105"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "🚀 Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-sm text-white text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-[#FFF2F2] hover:underline font-semibold">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;