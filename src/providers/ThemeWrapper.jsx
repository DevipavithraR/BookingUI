// src/providers/ThemeWrapper.js
import { useMemo } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { generateTheme } from "../utils/theme";

const ThemeWrapper = ({ children }) => {
  const themeState = useSelector((state) => state.theme);
  const theme = useMemo(() => generateTheme(themeState), [themeState]);

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};

export default ThemeWrapper;
