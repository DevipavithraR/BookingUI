// src/store/themeSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Theme color configurations
const themeColors = {
  dark: {
    background: {
      default: "#0f172a",
      paper: "#1e293b",
    },
    text: {
      primary: "#f8fafc",
      secondary: "#94a3b8",
    },
    divider: "#334155",
    header: "#1e293b",
    sidebar: {
      background: "#1e293b",
      activeItem: "rgba(79, 70, 229, 0.2)",
      text: "#e2e8f0",
      hover: "rgba(79, 70, 229, 0.1)",
    },
    components: {
      logisticsCard: {
        mainBg: "#1e293b",
        subCardBg: "rgba(255, 255, 255, 0.05)",
        border: "rgba(255, 255, 255, 0.2)",
        textPrimary: "#f8fafc",
        textSecondary: "#94a3b8",
        accentIcon: "#34d399",
        accentGlow: "rgba(52, 211, 153, 0.3)",
        viewAllBtn: {
          bg: "#065f46",
          text: "#d1fae5",
        },
      },
    },
  },
  light: {
    background: {
      default: "#f1f5f9",
      paper: "#ffffff",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },
    divider: "#e2e8f0",
    header: "#ffffff",
    sidebar: {
      background: "#ffffff",
      activeItem: "#f1f5ff",
      text: "#1e293b",
      hover: "rgba(79, 70, 229, 0.04)",
    },
    components: {
      logisticsCard: {
        mainBg: "#f1f5f9",
        subCardBg: "rgba(0, 0, 0, 0.03)",
        border: "rgba(0, 0, 0, 0.1)",
        textPrimary: "#1e293b",
        textSecondary: "#64748b",
        accentIcon: "#10b981",
        accentGlow: "rgba(16, 185, 129, 0.3)",
        viewAllBtn: {
          bg: "#e6fffa",
          text: "#065f46",
        },
      },
    },
  },
};

const getThemeColors = (isDarkMode) => ({
  primary: {
    main: "#4f46e5",
    light: "#818cf8",
    dark: "#4338ca",
  },
  ...themeColors[isDarkMode ? 'dark' : 'light'],
});

const initialState = {
  darkMode: true,
  sidebar: {
    open: true,
    width: 260,
    collapsedWidth: 72,
    variant: "persistent",
  },
  colors: getThemeColors(true),
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
      state.colors = getThemeColors(state.darkMode);
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      state.colors = getThemeColors(action.payload);
    },
    toggleSidebar: (state) => {
      state.sidebar.open = !state.sidebar.open;
    },
    setSidebarOpen: (state, action) => {
      state.sidebar.open = action.payload;
    },
    setSidebarVariant: (state, action) => {
      state.sidebar.variant = action.payload;
    },
  },
});

// Keep all selectors and exports the same
export const {
  toggleTheme,
  setDarkMode,
  toggleSidebar,
  setSidebarOpen,
  setSidebarVariant,
} = themeSlice.actions;

export const selectDarkMode = (state) => state.theme.darkMode;
export const selectSidebarOpen = (state) => state.theme.sidebar.open;
export const selectSidebarWidth = (state) =>
  state.theme.sidebar.open
    ? state.theme.sidebar.width
    : state.theme.sidebar.collapsedWidth;
export const selectSidebarVariant = (state) => state.theme.sidebar.variant;
export const selectColors = (state) => state.theme.colors;

export default themeSlice.reducer;