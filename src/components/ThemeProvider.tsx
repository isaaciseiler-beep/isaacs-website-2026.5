import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "dark" | "light" | "system";
type ResolvedTheme = "dark" | "light";
const STORAGE_KEY = "theme";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY);
    if (storedTheme === "dark" || storedTheme === "light" || storedTheme === "system") return storedTheme;
    return "system";
  });
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
  );
  const resolvedTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemTheme = () => setSystemTheme(media.matches ? "dark" : "light");

    updateSystemTheme();
    media.addEventListener("change", updateSystemTheme);
    return () => media.removeEventListener("change", updateSystemTheme);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, theme);
    const root = document.documentElement;

    root.classList.toggle("dark", resolvedTheme === "dark");
    root.classList.toggle("light", resolvedTheme === "light");
    root.dataset.themePreference = theme;
    root.style.colorScheme = resolvedTheme;
  }, [theme, resolvedTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
