import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // ✅ API URL
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
    console.log("🔹 Using API URL:", API_URL);

    async function submit(e) {
        e.preventDefault();
        setErrorMessage("");
        setLoading(true);

        if (!email || !password) {
            setErrorMessage("⚠️ Both fields are required!");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post(`${API_URL}/signup`, { email, password });

            console.log("✅ Server Response:", res.data);

            if (res.data === "exist") {
                setErrorMessage("⚠️ User already exists. Try logging in.");
            } else if (res.data === "notexist") {
                alert("✅ Signup successful!");
                navigate("/login");
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
                            className="w-full px-4 py-3 bg-[#A9B5DF] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white shadow-lg placeholder-white transition duration-300 ease-in-out autofill:bg-[#A9B5DF] autofill:text-white"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="relative">
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-3 bg-[#2D336B] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white shadow-lg placeholder-white transition duration-300 ease-in-out autofill:bg-[#2D336B] autofill:text-white"
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
