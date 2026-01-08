import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Box,
  useMediaQuery,
  IconButton,
  Badge,
  Popover,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Dashboard,
  AccountCircle,
  Map,
  Business,
  LocalShipping,
  Factory,
  Inventory2,
  StackedBarChart,
  Apartment,
} from "@mui/icons-material";
import { capitalizeWords } from "../../../utils/string_utils";
import { useTheme } from "@mui/material/styles";
import { useSidebar } from "../../../CustomHooks/useSidebar";
import MobileSidebar from "./MobileSidebar";

import { alpha } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { ReduxStorageManager } from "../../../store/reduxStorageManager";
import { selectDarkMode } from "../../../store/slicers/themeSlice";
import { selectAuthData } from "../../../store/slicers/authSlicer";
import { COMPANY_NAME, getMenuGroups } from "../../../../src/utils/constants";
import logo from "../../../assets/image/Media 3 (1).png";
import { service } from "../../../services/usersService";

const selectedColor = "#16a34a";

// Get menu groups with icons
const menuGroups = getMenuGroups({
  Dashboard: <Dashboard />,
  Map: <Map />,
  Inventory2: <Inventory2 />,
  Apartment: <Apartment />,
  Factory: <Factory />,
  LocalShipping: <LocalShipping />,
  StackedBarChart: <StackedBarChart />,
});

const Sidebar = () => {
  const darkMode = useSelector(selectDarkMode);
  const authData = useSelector(selectAuthData);
  const { isSidebarOpen, toggleSidebar, isMobileOpen, toggleMobile } =
    useSidebar();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState(null);

  // Get allowed routes for the user's roles
  const allowedRoutes = authData?.allowedRoutes || [];

  // Theme-dependent class names
  const themeClasses = {
    popoverBg: darkMode
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200",
    borderBottom: darkMode ? "border-gray-700" : "border-gray-100",
    textPrimary: darkMode ? "text-white" : "text-gray-900",
    textSecondary: darkMode ? "text-gray-400" : "text-gray-500",
    hoverBg: darkMode ? "hover:bg-red-900/20" : "hover:bg-red-50",
    logoutText: darkMode
      ? "text-red-400 group-hover:text-red-300"
      : "text-red-600 group-hover:text-red-700",
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Add your logout logic here
    handlePopoverClose();
    service.logout();
  };

  const collapsedWidth = 72;
  const expandedWidth = 260;

  const open = Boolean(anchorEl);

  if (isMobile) {
    return <MobileSidebar isOpen={isMobileOpen} onClose={toggleMobile} />;
  }

  return (
    <>
      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        open={true} // Always "open" since we handle collapse ourselves
        onClose={toggleSidebar}
        sx={{
          width: isSidebarOpen ? expandedWidth : collapsedWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isSidebarOpen ? expandedWidth : collapsedWidth,
            boxSizing: "border-box",
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.standard,
            }),
            borderRight: `1px solid ${theme.palette.divider}`,
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Company Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            minHeight: "64px",
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          {isSidebarOpen ? (
            <Typography
              variant="h6"
              noWrap
              sx={{ fontWeight: 700, display: "flex", alignItems: "center" }}
            >
              <img
                src={logo}
                alt="Company Logo"
                style={{ height: "24px", width: "auto", marginRight: "8px" }}
              />
              {COMPANY_NAME}
            </Typography>
          ) : (
            <img
              src={logo}
              alt="Company Logo"
              style={{ height: "28px", width: "auto" }}
            />
          )}
          <IconButton onClick={toggleSidebar} size="small">
            {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </Box>

        {/* Navigation */}
        <Box sx={{ flexGrow: 1, overflow: "auto", p: 1 }}>
          {menuGroups.map((group) => (
            <React.Fragment key={group.title}>
              {isSidebarOpen && (
                <Typography
                  variant="overline"
                  sx={{
                    display: "block",
                    px: 2,
                    py: 1,
                    color: theme.palette.text.secondary,
                  }}
                >
                  {group.title}
                </Typography>
              )}
              <List disablePadding>
                {group.items
                  .filter((item) => {
                    // Filter items based on allowed routes
                    if (
                      allowedRoutes.length > 0 &&
                      !allowedRoutes.includes("*")
                    ) {
                      return allowedRoutes.includes(item.path);
                    }
                    // If user is admin or no specific routes are set, show all items
                    return true;
                  })
                  .map((item) => (
                    <ListItem key={item.path} disablePadding>
                      <ListItemButton
                        component={Link}
                        to={item.path}
                        selected={location.pathname === item.path}
                        sx={{
                          borderRadius: 1,
                          mb: 0.5,
                          minHeight: "48px",
                          justifyContent: isSidebarOpen
                            ? "flex-start"
                            : "center",
                          "&.Mui-selected": {
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? alpha(selectedColor, 0.16)
                                : alpha(selectedColor, 0.12),
                            color: selectedColor,
                            "& .MuiListItemIcon-root": {
                              color: selectedColor,
                            },
                          },
                          "&.Mui-selected:hover": {
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? alpha(selectedColor, 0.24)
                                : alpha(selectedColor, 0.2),
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: "auto",
                            mr: isSidebarOpen ? 2 : 0,
                            justifyContent: "center",
                            color:
                              location.pathname === item.path
                                ? theme.palette.primary.main
                                : theme.palette.text.secondary,
                          }}
                        >
                          {item.title === "Live Tracking" ? (
                            <Badge color="error" variant="dot">
                              {item.icon}
                            </Badge>
                          ) : (
                            item.icon
                          )}
                        </ListItemIcon>
                        {isSidebarOpen && (
                          <ListItemText
                            primary={item.title}
                            primaryTypographyProps={{
                              noWrap: true,
                              fontWeight:
                                location.pathname === item.path ? 600 : 400,
                            }}
                          />
                        )}
                      </ListItemButton>
                    </ListItem>
                  ))}
              </List>
            </React.Fragment>
          ))}
        </Box>

        {/* User Footer */}
        <Box
          sx={{
            p: 1,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <ListItemButton
            onClick={handleProfileClick}
            sx={{
              borderRadius: 1,
              px: 1,
              py: 0.5,
              justifyContent: isSidebarOpen ? "flex-start" : "center",
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                mr: isSidebarOpen ? 1.5 : 0,
                bgcolor: theme.palette.primary.main,
              }}
            >
              <AccountCircle />
            </Avatar>
            {isSidebarOpen && (
              <Box sx={{ overflow: "hidden" }}>
                <Typography variant="subtitle2" noWrap>
                  {capitalizeWords(authData?.user?.username ?? "Alicess Doe")}
                </Typography>
              </Box>
            )}
          </ListItemButton>
        </Box>
      </Drawer>

      {/* Popover for logout */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom", // Changed from "top" to "bottom"
          horizontal: "left", // This will position it at the right edge of the sidebar
        }}
        transformOrigin={{
          vertical: "top", // Changed from "bottom" to "top"
          horizontal: "left", // This will make it appear to the right of the sidebar
        }}
        PaperProps={{
          sx: {
            mt: 1,
            ml: isSidebarOpen ? 0 : -1, // Adjusted margin
            background: "transparent",
            boxShadow: "none",
            overflow: "visible",
          },
        }}
      >
        {/* Tailwind CSS Popover Content */}
        <div
          className={`rounded-lg shadow-xl overflow-hidden w-48 ml-2 border ${themeClasses.popoverBg}`}
        >
          {/* User info section */}
          <div className={`p-3 border-b ${themeClasses.borderBottom}`}>
            <p className={`text-sm font-medium ${themeClasses.textPrimary}`}>
              {capitalizeWords(authData?.user?.username ?? "Alice Doe")}
            </p>
            <p className={`text-xs ${themeClasses.textSecondary}`}>
              {authData?.user?.roles[0] ?? ""}
            </p>
          </div>

          {/* Logout option */}
          <div
            className={`flex items-center px-4 py-3 cursor-pointer transition-colors group ${themeClasses.hoverBg}`}
            onClick={handleLogout}
          >
            <div className="flex items-center justify-center w-5 h-5 mr-3 text-red-500">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>
            <span className={`text-sm font-medium ${themeClasses.logoutText}`}>
              Logout
            </span>
          </div>
        </div>
      </Popover>
    </>
  );
};

export default Sidebar;
