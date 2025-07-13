import React, { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import "../styles/CodeEditor.css";

const GEMINI_API_KEY = "AIzaSyDp9Q7j360oitWZ_XqjCTJP89TCBPSbSvs";

const runGemini = async (prompt) => {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
      GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );
  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
};

// Code execution using Judge0 API for JavaScript, Python, and C++ with user input (stdin)
const runCode = async (language, code, stdin = "") => {
  const langIdMap = {
    javascript: 63, // Node.js
    python: 71,     // Python 3
    cpp: 54,        // C++ (GCC 9.2.0)
  };
  const language_id = langIdMap[language];
  if (!language_id) return "Language not supported.";

  const submitRes = await fetch("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-RapidAPI-Key": "5f8a56d309msh44bd7d797b523e7p196fcdjsn7ca0794d584a",
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
    },
    body: JSON.stringify({
      source_code: code,
      language_id,
      stdin
    })
  });
  if (!submitRes.ok) {
    return `Error: ${submitRes.status} ${submitRes.statusText}`;
  }
  const result = await submitRes.json();
  if (result.stderr) return result.stderr;
  if (result.compile_output) return result.compile_output;
  return result.stdout || "No output";
};

const defaultCode = {
  javascript: "// Write JavaScript code here\nconsole.log('Hello JS!');",
  python: "# Write Python code here\nprint('Hello Python!')",
  cpp: "// Write C++ code here\n#include <iostream>\nint main() {\n  std::cout << \"Hello C++!\";\n  return 0;\n}",
};

const CodeEditor = () => {
  const { darkMode } = useContext(ThemeContext);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(defaultCode["javascript"]);
  const [output, setOutput] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [waitingForInput, setWaitingForInput] = useState(false);

  // Helper to detect if code needs input
  const codeNeedsInput = (code, language) => {
    if (language === "python") {
      return /input\s*\(/.test(code);
    } else if (language === "cpp") {
      return /cin\s*>>|scanf\s*\(/.test(code);
    } else if (language === "javascript") {
      return /prompt\s*\(/.test(code);
    }
    return false;
  };

  const handleRun = async () => {
    if (codeNeedsInput(code, language) && !userInput) {
      setOutput("Please provide input for your code and press Enter.");
      setWaitingForInput(true);
      return;
    }
    setOutput("Running...");
    setWaitingForInput(false);
    const result = await runCode(language, code, userInput);
    setOutput(result);
    setUserInput("");
  };

  const handleBugFix = async () => {
    setLoading(true);
    setSuggestion("Loading...");
    const prompt = `Find and fix bugs in this ${language} code:\n${code}`;
    const res = await runGemini(prompt);
    setSuggestion(res);
    setLoading(false);
  };

  const handleSuggest = async () => {
    setLoading(true);
    setSuggestion("Loading...");
    const prompt = `Suggest improvements for this ${language} code:\n${code}`;
    const res = await runGemini(prompt);
    setSuggestion(res);
    setLoading(false);
  };

  // New: Ask AI to generate code
  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setLoading(true);
    setSuggestion("Generating code...");
    const prompt = `Write a ${language} code for: ${aiPrompt}`;
    const res = await runGemini(prompt);
    setSuggestion(res);
    setLoading(false);
  };

  const handleLangChange = (e) => {
    setLanguage(e.target.value);
    setCode(defaultCode[e.target.value]);
    setOutput("");
    setSuggestion("");
  };

  return (
    <Layout>
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-2`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 space-y-8 border border-gray-200 dark:border-gray-700"
        >
          <h1 className="text-4xl font-bold text-center text-teal-600 dark:text-teal-400 mb-2">Code Editor</h1>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <div className="flex flex-col gap-2">
                <label className="font-semibold">Language</label>
                <select
                  value={language}
                  onChange={handleLangChange}
                  className="p-2 rounded-md border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold">Your Code</label>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full min-h-[200px] p-3 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white font-mono text-base resize-y"
                  placeholder="Write your code here..."
                />
              </div>
              <div className="flex gap-3 mt-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-gradient-to-r from-teal-500 to-teal-400 text-white rounded-lg shadow-md hover:from-teal-600 hover:to-teal-500 font-semibold text-lg transition-all"
                  onClick={handleRun}
                >
                  Run Code
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-yellow-400 text-white rounded-lg shadow-md hover:bg-yellow-500 font-semibold text-lg transition-all"
                  onClick={handleBugFix}
                  disabled={loading}
                >
                  Bug Fix
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 font-semibold text-lg transition-all"
                  onClick={handleSuggest}
                  disabled={loading}
                >
                  Suggest
                </motion.button>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold mb-1">Output</h3>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-3 min-h-[60px] font-mono text-base">
                  {waitingForInput ? (
                    <input
                      type="text"
                      className="w-full bg-transparent outline-none"
                      placeholder="Enter input for your code and press Enter..."
                      value={userInput}
                      onChange={e => setUserInput(e.target.value)}
                      onKeyDown={async e => {
                        if (e.key === "Enter") {
                          setOutput("Running...");
                          setWaitingForInput(false);
                          const result = await runCode(language, code, e.target.value);
                          setOutput(result);
                          setUserInput("");
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <pre className="whitespace-pre-wrap break-words">{output}</pre>
                  )}
                </div>
              </div>
            </div>
            {/* AI Section */}
            <div className="flex-1 space-y-4">
              <div className="bg-gradient-to-br from-teal-100 to-blue-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-5 shadow-md flex flex-col gap-3">
                <h3 className="font-semibold text-lg text-teal-700 dark:text-teal-300 mb-2">Ask AI to generate your code</h3>
                <textarea
                  className="w-full min-h-[80px] p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono text-base resize-y"
                  placeholder="Describe what you want to build..."
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  disabled={loading}
                />
                <button
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg shadow-md hover:from-teal-600 hover:to-blue-600 font-semibold transition-all"
                  onClick={handleAIGenerate}
                  disabled={loading || !aiPrompt.trim()}
                >
                  {loading ? "Generating..." : "Generate Code"}
                </button>
                <div className="mt-2">
                  <h4 className="font-semibold mb-1">AI Output</h4>
                  <pre className="bg-gray-100 dark:bg-gray-800 rounded-md p-2 min-h-[60px] font-mono text-base whitespace-pre-wrap break-words">{suggestion}</pre>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm mt-4">
                <h3 className="font-semibold mb-2">How to use</h3>
                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 text-sm space-y-1">
                  <li>Select your preferred programming language</li>
                  <li>Write or paste your code in the editor</li>
                  <li>Click <strong>Run Code</strong> to execute</li>
                  <li>Use <strong>Bug Fix</strong> or <strong>Suggest</strong> for AI assistance</li>
                  <li>Or, describe your task in the AI box to generate code</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default CodeEditor;