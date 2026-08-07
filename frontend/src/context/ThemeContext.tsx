"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type ThemeMode = "dark" | "light";

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("rescueai_theme") as ThemeMode;
      if (saved === "light" || saved === "dark") {
        setTheme(saved);
      }
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("rescueai_theme", next);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme === "light" ? "theme-light" : "theme-dark"}>{children}</div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
