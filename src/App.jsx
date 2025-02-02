import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";

function App() {
  return (
    <ThemeProvider>
      <Header />
      <main>
        <Hero />
        <Features />
      </main>
    </ThemeProvider>
  );
}

export default App;
