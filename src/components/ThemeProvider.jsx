import react from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Create a context with default theme as 'system'
const ThemeContext = createContext({
  theme: 'system',
  setTheme: () => {},
});

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
}) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(storageKey) || defaultTheme
  );

  useEffect(() => {
    const root = document.documentElement; // Access document root
    root.classList.remove('light', 'dark'); // Remove any previous theme classes

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme); // Apply system theme
    } else {
      root.classList.add(theme); // Apply custom theme (light/dark)
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme) => {
      localStorage.setItem(storageKey, newTheme); // Save theme to localStorage
      setTheme(newTheme);
    },
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
