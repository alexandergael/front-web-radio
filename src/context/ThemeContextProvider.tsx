"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import React, { ReactNode, useEffect, useState } from "react";
import { themeCreator } from "./theme/base";

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeContextProvider({ children }: ThemeProviderProps) {
  const [themeName, setThemeName] = useState<string | null>(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem("appTheme") || "PureLightTheme";
    setThemeName(storedTheme);
  }, []);
  if (!themeName) {
    return null;
  }
  const theme = themeCreator(themeName);

  const updateTheme = (themeName: string): void => {
    localStorage.setItem("appTheme", themeName);
    setThemeName(themeName);
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeContext.Provider value={{ themeName, setThemeName: updateTheme }}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </ThemeContext.Provider>
    </StyledEngineProvider>
  );
}

export const ThemeContext = React.createContext<{
  themeName: string;
  setThemeName: (themeName: string) => void;
}>({
  themeName: "",
  setThemeName: () => {},
});
