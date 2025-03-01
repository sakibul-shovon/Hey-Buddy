import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import FindBuddy from "./pages/FindBuddy";
import MicroProjectsPage from "./pages/MicroProjectsPage";
import ShowcaseProjectsPage from "./pages/ShowcaseProjectsPage";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat"; // Add this import

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout><LandingPage /></Layout>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/dashboard"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            <Route
              path="/find_buddy"
              element={<ProtectedRoute><Layout><FindBuddy /></Layout></ProtectedRoute>}
            />
            <Route
              path="/micro_project"
              element={<ProtectedRoute><Layout><MicroProjectsPage /></Layout></ProtectedRoute>}
            />
            <Route
              path="/show_case"
              element={<ProtectedRoute><Layout><ShowcaseProjectsPage /></Layout></ProtectedRoute>}
            />
            <Route
              path="/chat"
              element={<ProtectedRoute><Layout><Chat /></Layout></ProtectedRoute>}
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;