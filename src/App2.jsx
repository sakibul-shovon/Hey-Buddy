import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Code2,
  Users,
  MessageSquare,
  Rocket,
  Trophy,
  Calendar,
  Layout,
  Shield,
  ArrowRight,
  Github,
  Twitter,
  MoonIcon,
  SunIcon,
  Users2,
  Zap,
} from "lucide-react";

// Utils
const cn = (...inputs) => {
  return inputs.filter(Boolean).join(" ");
};

// Theme Context
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("system");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

const useTheme = () => useContext(ThemeContext);

// Button Component
const buttonVariants = {
  variant: {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  },
  size: {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  },
};

const Button = React.forwardRef(
  (
    { className, variant = "default", size = "default", children, ...props },
    ref
  ) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

// Header Component
function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <a href="/" className="flex items-center space-x-2">
          <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-xl font-bold text-transparent">
            Hey Buddy
          </span>
        </a>
        <nav className="flex items-center gap-6">
          <a
            href="#features"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Features
          </a>
          <a
            href="#community"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Community
          </a>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button>Get Started</Button>
        </nav>
      </div>
    </header>
  );
}

// Hero Component
function Hero() {
  return (
    <section className="container flex flex-col items-center justify-center gap-4 py-24 text-center md:py-32">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Connect. Collaborate.{" "}
          <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
            Create.
          </span>
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Find your perfect coding buddy, collaborate on projects, and grow
          together in a vibrant community of developers and designers.
        </p>
      </div>
      <div className="flex flex-col gap-2 min-[400px]:flex-row">
        <Button size="lg" className="gap-2">
          <Users2 className="h-4 w-4" />
          Find Buddies
        </Button>
        <Button size="lg" variant="outline" className="gap-2">
          <Zap className="h-4 w-4" />
          Explore Projects
        </Button>
      </div>
    </section>
  );
}

// Features Component
const features = [
  {
    title: "Find Teammates",
    description: "AI-powered matching based on skills and interests",
    Icon: Users,
  },
  {
    title: "Collaboration Hub",
    description: "Team management tools and project coordination",
    Icon: Code2,
  },
  {
    title: "Help Forum",
    description: "Tag-based discussions and mentor access",
    Icon: MessageSquare,
  },
  {
    title: "MicroProjects",
    description: "Quick bids, reviews, and instant chat",
    Icon: Rocket,
  },
  {
    title: "Gamification",
    description: "Achievements, badges, and leaderboards",
    Icon: Trophy,
  },
  {
    title: "Event Management",
    description: "Create and manage hackathons and meetups",
    Icon: Calendar,
  },
  {
    title: "Personalized Dashboard",
    description: "Dynamic feed and activity summaries",
    Icon: Layout,
  },
  {
    title: "Security First",
    description: "Advanced security and moderation tools",
    Icon: Shield,
  },
];

function Features() {
  return (
    <section id="features" className="container py-24">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
          Powerful Features
        </h2>
        <p className="max-w-[85%] text-muted-foreground sm:text-lg">
          Everything you need to connect, collaborate, and create amazing
          projects together.
        </p>
      </div>
      <div className="mx-auto grid gap-8 py-16 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 lg:grid-cols-4">
        {features.map(({ title, description, Icon }) => (
          <div
            key={title}
            className="relative overflow-hidden rounded-lg border bg-background p-4 transition-all hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div className="mt-4 space-y-2">
              <h3 className="font-bold">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Stats Component
function Stats() {
  return (
    <section id="community" className="container py-24">
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
        <div className="flex flex-col items-center justify-center rounded-lg border bg-background p-8">
          <div className="text-4xl font-bold text-primary">50K+</div>
          <p className="mt-2 text-sm text-muted-foreground">Active Members</p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border bg-background p-8">
          <div className="text-4xl font-bold text-primary">1000+</div>
          <p className="mt-2 text-sm text-muted-foreground">Projects Created</p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border bg-background p-8">
          <div className="text-4xl font-bold text-primary">75%</div>
          <p className="mt-2 text-sm text-muted-foreground">Success Rate</p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border bg-background p-8">
          <div className="text-4xl font-bold text-primary">24/7</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Community Support
          </p>
        </div>
      </div>
    </section>
  ); 
}

// CTA Component
function CTA() {
  return (
    <section className="border-t bg-muted/50">
      <div className="container py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
            Ready to find your coding buddy?
          </h2>
          <p className="max-w-[85%] text-muted-foreground sm:text-lg">
            Join thousands of developers and designers who are already
            collaborating and growing together.
          </p>
          <Button size="lg" className="mt-4 gap-2">
            Get Started Now
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-sm leading-loose text-center text-muted-foreground md:text-left">
            Built with love for developers and designers.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://github.com" target="_blank" rel="noreferrer">
            <Github className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">
            <Twitter className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </a>
        </div>
      </div>
    </footer>
  );
}

// Main App Component
function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen w-full">
        <div className="mx-auto container px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="min-h-screen bg-background">
            <Header />
            <main>
              <Hero />
              <Features />
              <Stats />
              <CTA />
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
