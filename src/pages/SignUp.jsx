import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Signup() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useContext(AuthContext); // Access Auth Context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect to landing page if already authenticated
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate("/"); // Redirect to Landing Page
  //   }
  // }, [isAuthenticated, navigate]);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  async function submit(e) {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    if (!email || !password) {
      setErrorMessage("⚠️ All fields are required!");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/signup`, { email, password });

      if (res.data.error) {
        setErrorMessage(`⚠️ ${res.data.error}`);
      } else if (res.data.token) {
        // ✅ Save token and user email in context
        login(res.data.token, res.data.email);
        alert("✅ Signup successful!");
        navigate("/dashboard");
      } else {
        setErrorMessage("❌ Unexpected response. Please try again.");
      }
    } catch (error) {
      console.error("❌ Signup Error:", error);
      setErrorMessage("⚠️ Server error. Please try again.");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">
          Create Account
        </h1>

        {errorMessage && (
          <p className="text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-md mb-6">
            {errorMessage}
          </p>
        )}

        <form onSubmit={submit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-gray-200 text-gray-900 placeholder-gray-400 dark:placeholder-gray-500 transition duration-200"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-gray-200 text-gray-900 placeholder-gray-400 dark:placeholder-gray-500 transition duration-200"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 dark:bg-teal-500 text-white font-medium py-3 px-6 rounded-md hover:bg-teal-700 dark:hover:bg-teal-400 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600 dark:text-gray-400 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-teal-600 dark:text-teal-400 hover:underline font-medium"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
