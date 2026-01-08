import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen: true,
  isMobileOpen: false,
};

export const sideBarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    toggleMobileSidebar: (state) => {
      state.isMobileOpen = !state.isMobileOpen;
    },
    closeMobileSidebar: (state) => {
      state.isMobileOpen = false;
    },
  },
});

export const { toggleSidebar, toggleMobileSidebar, closeMobileSidebar } = sideBarSlice.actions;
export default sideBarSlice.reducer;