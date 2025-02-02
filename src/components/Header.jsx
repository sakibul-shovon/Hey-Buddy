import { useTheme } from "../context/ThemeContext";
import Button from "./Button";
import { MoonIcon, SunIcon } from "lucide-react";

function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <a href="/" className="flex items-center space-x-2">
          <span className="bg-gradient-to-r from-pink-500 to-violet-500 text-xl font-bold text-transparent">
            Hey Buddy
          </span>
        </a>
        <nav className="flex items-center gap-6">
          <a href="#features" className="text-sm font-medium hover:underline">
            Features
          </a>
          <a href="#community" className="text-sm font-medium hover:underline">
            Community
          </a>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <SunIcon className="h-5 w-5 transition-all dark:hidden" />
            <MoonIcon className="hidden h-5 w-5 transition-all dark:block" />
          </Button>
          <Button>Get Started</Button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
