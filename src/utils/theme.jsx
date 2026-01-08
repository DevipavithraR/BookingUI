import { createTheme } from "@mui/material/styles";

export const generateTheme = (themeState) => {
  return createTheme({
    palette: {
      mode: themeState.darkMode ? "dark" : "light",
      primary: {
        main: themeState.colors.primary.main,
        light: themeState.colors.primary.light,
        dark: themeState.colors.primary.dark,
      },
      background: {
        default: themeState.colors.background.default,
        paper: themeState.colors.background.paper,
      },
      text: {
        primary: themeState.colors.text.primary,
        secondary: themeState.colors.text.secondary,
      },
      divider: themeState.colors.divider,
    },
    components: {},
  });
};
