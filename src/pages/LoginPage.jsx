import React, { useState } from "react";
import { FaUsers, FaCode, FaBook } from "react-icons/fa";


const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="flex h-screen">
      {isSignUp ? (
        <div className="w-full flex flex-col justify-center items-center bg-gray-50 p-10">
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-4">Create an Account</h2>
            <label className="block text-gray-700">Username</label>
            <input type="text" className="w-full p-2 border rounded-lg mt-1" placeholder="Enter your username" />
            <label className="block text-gray-700 mt-4">Email</label>
            <input type="email" className="w-full p-2 border rounded-lg mt-1" placeholder="Enter your email" />
            <label className="block text-gray-700 mt-4">Password</label>
            <input type="password" className="w-full p-2 border rounded-lg mt-1" placeholder="Enter your password" />
            <button className="w-full bg-blue-600 text-white p-2 rounded-lg mt-4 hover:bg-blue-700">Sign Up</button>
            <p className="text-center mt-4">Already have an account? <span className="text-blue-500 cursor-pointer" onClick={() => setIsSignUp(false)}>Sign In</span></p>
          </div>
        </div>
      ) : (
        <>
          <div className="w-1/2 flex flex-col justify-center items-center bg-gray-50 p-10">
            <div className="w-full max-w-md">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold">Welcome to Hey Buddy</div>
                <p className="text-gray-600">The developer's workspace. Let's build something great.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <label className="block text-gray-700">Username</label>
                <input type="text" className="w-full p-2 border rounded-lg mt-1" placeholder="Enter your username" />
                <label className="block text-gray-700 mt-4">Password</label>
                <input type="password" className="w-full p-2 border rounded-lg mt-1" placeholder="Enter your password" />
                <div className="flex justify-between items-center mt-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Remember me
                  </label>
                  <a href="#" className="text-blue-500">Forgot password?</a>
                </div>
                <button className="w-full bg-blue-600 text-white p-2 rounded-lg mt-4 hover:bg-blue-700">Sign In</button>
                <div className="text-center my-4 text-gray-500">OR CONTINUE WITH</div>
                <button className="w-full border p-2 rounded-lg flex items-center justify-center">
                  <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" className="w-5 h-5 mr-2" />
                  GitHub
                </button>
              </div>
              <p className="text-center mt-4">New to Hey Buddu? <span className="text-blue-500 cursor-pointer" onClick={() => setIsSignUp(true)}>Create an account</span></p>
            </div>
          </div>

          <div className="w-1/2 bg-blue-600 text-white flex flex-col justify-center p-10">
            <h2 className="text-3xl font-bold mb-6">Where Code Meets Community</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaUsers className="text-white text-xl" />
                <div>
                  <h3 className="text-xl font-semibold">Real-time Collaboration</h3>
                  <p>Code together in real-time with developers worldwide</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FaCode className="text-white text-xl" />
                <div>
                  <h3 className="text-xl font-semibold">Smart Code Reviews</h3>
                  <p>Get instant feedback on your code from experts</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FaBook className="text-white text-xl" />
                <div>
                  <h3 className="text-xl font-semibold">Developer Resources</h3>
                  <p>Access a vast library of coding resources and tutorials</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      
    </div>
  );
};

export default LoginPage;
