import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";

import FindBuddy from "./pages/FindBuddy";
import MicroProjectsPage from "./pages/MicroProjectsPage";
import ShowcaseProjectsPage from "./pages/ShowcaseProjectsPage";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/find_budy" element={<FindBuddy/>} />
          <Route path="/micro_project" element={<MicroProjectsPage />} />
          <Route path="/show_case" element={<ShowcaseProjectsPage/>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
