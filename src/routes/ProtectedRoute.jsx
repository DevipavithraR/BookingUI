import { Navigate, Outlet, useLocation, matchPath } from "react-router-dom";
import { useSelector } from "react-redux";
import { isAdmin, selectAuthData } from "../store/slicers/authSlicer";
import { app_routes } from "../utils/constants";

const ProtectedRoute = () => {
  const authData = useSelector(selectAuthData);
  const location = useLocation();
  if (!authData?.user) {
    return <Navigate to={app_routes.login} replace />;
  }
  // if user is Admin bypass all rules
  if (authData?.user?.roles?.includes("Admin")) {
    return <Outlet />;
  }
  const isAllowed = authData?.allowedRoutes?.some((route) =>
    matchPath(route, location.pathname)
  );

  if (!isAllowed) {
    return <Navigate to={app_routes.unauthorized} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
