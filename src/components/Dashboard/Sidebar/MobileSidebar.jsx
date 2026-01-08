import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  IconButton,
  Badge,
  Collapse,
  Paper,
} from "@mui/material";
import {
  ChevronLeft,
  Dashboard,
  AccountCircle,
  Map,
  Business,
  LocalShipping,
  Factory,
  Inventory2,
  StackedBarChart,
  Apartment,
  Logout,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { ReduxStorageManager } from "../../../store/reduxStorageManager";
import { selectAuthData } from "../../../store/slicers/authSlicer";
import { capitalizeWords } from "../../../utils/string_utils";
import {
  app_routes,
  COMPANY_NAME,
  getMenuGroups,
} from "../../../../src/utils/constants";
import { service } from "../../../services/usersService";

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

const MobileSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const theme = useTheme();
  const navigate = useNavigate();
  const expandedWidth = 260;

  // Get auth data from Redux
  const authData = useSelector(selectAuthData);

  // Get allowed routes for the user's roles
  const allowedRoutes = authData?.allowedRoutes || [];

  // State to control the profile menu expansion
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    // Close the sidebar
    onClose();
    service.logout();
  };

  const handleProfileClick = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  return (
    <Drawer
      variant="temporary"
      open={isOpen}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile
      }}
      sx={{
        "& .MuiDrawer-paper": {
          width: expandedWidth,
          boxSizing: "border-box",
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      {/* Mobile Header */}
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
        <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>
          <Business sx={{ mr: 1, verticalAlign: "middle" }} />
          {COMPANY_NAME}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <ChevronLeft />
        </IconButton>
      </Box>

      {/* Mobile Navigation */}
      <Box sx={{ flexGrow: 1, overflow: "auto", p: 1 }}>
        {menuGroups.map((group) => (
          <React.Fragment key={group.title}>
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
                      onClick={onClose}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        minHeight: "48px",
                        "&.Mui-selected": {
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? alpha(theme.palette.primary.main, 0.16)
                              : alpha(theme.palette.primary.main, 0.12),
                          color: theme.palette.primary.main,
                          "& .MuiListItemIcon-root": {
                            color: theme.palette.primary.main,
                          },
                        },
                        "&.Mui-selected:hover": {
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? alpha(theme.palette.primary.main, 0.24)
                              : alpha(theme.palette.primary.main, 0.2),
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: "auto",
                          mr: 2,
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
                      <ListItemText
                        primary={item.title}
                        primaryTypographyProps={{ noWrap: true }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
            </List>
          </React.Fragment>
        ))}
      </Box>

      {/* Mobile User Footer */}
      <Box
        sx={{
          p: 1,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* Profile Button */}
        <ListItemButton
          onClick={handleProfileClick}
          sx={{
            borderRadius: 1,
            px: 1,
            py: 0.5,
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              mr: 1.5,
              bgcolor: theme.palette.primary.main,
            }}
          >
            <AccountCircle />
          </Avatar>
          <Box sx={{ overflow: "hidden", flexGrow: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {capitalizeWords(authData?.user?.username ?? "Alice Doe")}
            </Typography>
            <Typography variant="caption" color="textSecondary" noWrap>
              {authData?.user?.roles[0] ?? "Admin"}
            </Typography>
          </Box>
          {profileMenuOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        {/* Profile Menu with Logout Option */}
        <Collapse in={profileMenuOpen} timeout="auto" unmountOnExit>
          <Paper
            elevation={3}
            sx={{
              mt: 1,
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 0,
                px: 2,
                py: 1,
                color: theme.palette.error.main,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.error.main, 0.08),
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: "auto",
                  mr: 2,
                  color: theme.palette.error.main,
                }}
              >
                <Logout />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{ noWrap: true }}
              />
            </ListItemButton>
          </Paper>
        </Collapse>
      </Box>
    </Drawer>
  );
};

MobileSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MobileSidebar;
