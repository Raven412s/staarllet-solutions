"use client"
import { createContext, useContext, useState } from "react";

type ThemeType = "light" | "dark";

const SectionThemeContext = createContext<{
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}>({
  theme: "light",
  setTheme: () => {},
});

export const useSectionTheme = () => useContext(SectionThemeContext);

export const SectionThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>("light");

  return (
    <SectionThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </SectionThemeContext.Provider>
  );
};
