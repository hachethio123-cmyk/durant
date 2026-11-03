
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type Theme = "dark" | "light" | "system";
type Language = "ar" | "en";
type FontSize = "small" | "medium" | "large";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  languageReady: boolean;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}

export function useLanguage() {
  const context = useTheme();

  return {
    language: context.language,
    setLanguage: context.setLanguage,
    languageReady: context.languageReady,
  };
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [language, setLanguage] = useState<Language>("ar");
  const [fontSize, setFontSize] = useState<FontSize>("medium");

  const [ready, setReady] = useState(false);
  const [languageReady, setLanguageReady] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("durant-theme");
    const savedLanguage = localStorage.getItem("durant-language");
    const savedFontSize = localStorage.getItem("durant-font-size");

    if (
      savedTheme === "dark" ||
      savedTheme === "light" ||
      savedTheme === "system"
    ) {
      setTheme(savedTheme);
    }

    if (savedLanguage === "ar" || savedLanguage === "en") {
      setLanguage(savedLanguage);
    }

    if (
      savedFontSize === "small" ||
      savedFontSize === "medium" ||
      savedFontSize === "large"
    ) {
      setFontSize(savedFontSize);
    }

    setReady(true);
    setLanguageReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    localStorage.setItem("durant-theme", theme);

    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    function applyTheme() {
      root.classList.remove("dark", "light");

      if (theme === "system") {
        root.classList.add(media.matches ? "dark" : "light");
      } else {
        root.classList.add(theme);
      }
    }

    applyTheme();

    if (theme === "system") {
      media.addEventListener("change", applyTheme);
      return () => media.removeEventListener("change", applyTheme);
    }
  }, [theme, ready]);

  useEffect(() => {
    if (!languageReady) return;

    localStorage.setItem("durant-language", language);

    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language, languageReady]);

  useEffect(() => {
    if (!ready) return;

    localStorage.setItem("durant-font-size", fontSize);

    const root = document.documentElement;

    root.dataset.fontSize = fontSize;

    const sizes: Record<FontSize, string> = {
      small: "14px",
      medium: "16px",
      large: "18px",
    };

    root.style.setProperty("--durant-font-size", sizes[fontSize]);
  }, [fontSize, ready]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        language,
        setLanguage,
        fontSize,
        setFontSize,
        languageReady,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
