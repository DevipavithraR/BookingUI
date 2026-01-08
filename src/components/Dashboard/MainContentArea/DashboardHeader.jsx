import { useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  InputBase,
  styled,
  alpha,
  Breadcrumbs,
  Link,
  useMediaQuery,
} from "@mui/material";
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../../store/slicers/themeSlice";
import { useSidebar } from "../../../CustomHooks/useSidebar";
import { formatDate, getNowStr } from "../../../utils/time_utils";
import { date_formats } from "../../../utils/constants";

const Search = styled("div")(({ theme, darkMode }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, darkMode ? 0.05 : 0.1),
  },
  marginLeft: theme.spacing(2),
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "20ch",
    },
  },
}));

const IconWrapper = styled(IconButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.common.white, 0.1),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  marginLeft: theme.spacing(1),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.2),
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(0.5),
    marginLeft: theme.spacing(0.5),
  },
}));

// --- MODIFIED: Increased the font size for better visibility ---
const DateBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1, 1.5),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: alpha(theme.palette.common.white, 0.1),
  marginLeft: theme.spacing(1),
  fontSize: "1rem", // Changed from "0.875rem" to "1rem"
  whiteSpace: "nowrap",
}));

const ContentTop = () => {
  const theme = useTheme();
  const location = useLocation();
  const darkMode = useSelector((state) => state.theme.darkMode);
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { toggleSidebar, toggleMobile } = useSidebar();

  const handleMenuClick = () => {
    if (isMobile) {
      toggleMobile();
    } else {
      toggleSidebar();
    }
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "transparent",
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        px: isMobile ? 2 : 3,
        py: isMobile ? 0.5 : 1,
        backgroundImage: "none",
        width: "100%",
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          minHeight: isMobile ? 56 : 64,
          justifyContent: "space-between",
        }}
      >
        {/* Left side: Menu icon and breadcrumbs */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            minWidth: 0,
          }}
        >
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              sx={{ mr: 1, flexShrink: 0 }}
              onClick={handleMenuClick}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          )}

          <Breadcrumbs
            aria-label="breadcrumb"
            separator="›"
            sx={{ color: theme.palette.text.secondary }}
          >
            <Link
              underline="hover"
              color="inherit"
              href="#"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              <Typography
                component="span"
                sx={{ fontSize: isMobile ? "0.875rem" : "inherit" }}
              >
                Dashboard
              </Typography>
            </Link>
            <Typography
              color="text.primary"
              sx={{ fontWeight: "bold" }}
              noWrap
              fontSize={isMobile ? "0.875rem" : "inherit"}
            >
              {location.pathname === "/"
                ? "Home"
                : location.pathname.startsWith("/")
                ? location.pathname.slice(1)
                : location.pathname}
            </Typography>
          </Breadcrumbs>
        </Box>

        {/* Right side: Date and theme toggle */}
        {/* The parent Box with alignItems: "center" handles the vertical alignment */}
        <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          <DateBox>
            <CalendarIcon
              // --- MODIFIED: Increased icon size to balance with the larger text ---
              sx={{
                mr: 1,
                fontSize: "1.25rem",
              }}
            />
            {getNowStr()}
          </DateBox>

          <IconWrapper onClick={() => dispatch(toggleTheme())}>
            {/* --- MODIFIED: Increased icon size for better alignment and visibility --- */}
            {darkMode ? (
              <LightModeIcon fontSize="medium" />
            ) : (
              <DarkModeIcon fontSize="medium" />
            )}
          </IconWrapper>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default ContentTop;
