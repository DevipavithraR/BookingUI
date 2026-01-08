import { useSelector, useDispatch } from "react-redux";
import {
  toggleSidebar,
  toggleMobileSidebar,
} from "../store/slicers/sideBarSlicer";

export const useSidebar = () => {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => state.sidebar.isSidebarOpen);
  const isMobileOpen = useSelector((state) => state.sidebar.isMobileOpen);

  return {
    isSidebarOpen,
    isMobileOpen,
    toggleSidebar: () => dispatch(toggleSidebar()),
    toggleMobile: () => dispatch(toggleMobileSidebar()),
  };
};
