import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

import FindBuddy from "./pages/FindBuddy";
import MicroProjectsPage from "./pages/MicroProjectsPage";
import ShowcaseProjectsPage from "./pages/ShowcaseProjectsPage";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/find_buddy" element={<FindBuddy/>} />
          <Route path="/micro_project" element={<MicroProjectsPage />} />
          <Route path="/show_case" element={<ShowcaseProjectsPage/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
