import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import ContentTop from "./DashboardHeader";
import { useSelector } from "react-redux";
import { useTheme } from "@emotion/react";

const MainPanel = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const theme = useTheme();
  // removed unused isMobile (no longer needed after simplifying px)

  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        backgroundColor: darkMode
          ? theme.palette.background.default
          : "#f8f9fa", // Light gray for main bg in light mode
        py: 0,
        pb: 5,
        px: 0,
        display: "flex",
        flexDirection: "column",
        gap: 5,
        height: "100vh",
        overflow: "auto",
        "@media (max-width: 1400px)": {
          px: 5,
        },
        "@media (max-width: 1200px)": {
          px: 4,
        },
      }}
    >
      <ContentTop />

      <Outlet />
    </Box>
  );
};

export default MainPanel;