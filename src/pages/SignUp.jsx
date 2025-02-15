import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    async function submit(e) {
        e.preventDefault();

        if (!email || !password) {
            setErrorMessage("Both fields are required!");
            return;
        }

        try {
            const res = await axios.post("http://localhost:8000/signup", { email, password });

            console.log("Response:", res.data);

            if (res.data === "exist") {
                setErrorMessage("User already exists. Try logging in.");
            } else if (res.data === "notexist") {
                alert("Signup successful!");
                navigate("/", { state: { id: email } });
            } else {
                setErrorMessage("Unexpected response: " + res.data);
            }
        } catch (error) {
            console.error("Signup Error:", error);
            setErrorMessage("Something went wrong. Try again.");
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Create an Account</h1>

                {errorMessage && (
                    <p className="text-red-500 text-sm text-center bg-red-100 p-2 rounded-lg mb-4">
                        {errorMessage}
                    </p>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 ease-in-out shadow-md"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="mt-4 text-sm text-gray-600 text-center">
                    Already have an account?{" "}
                    <Link to="/" className="text-blue-600 hover:underline">
                        Log in here
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;
