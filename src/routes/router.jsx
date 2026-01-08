import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import LoginForm from "../Pages/LoginPage";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHome from "../Pages/DashboardPage";
import SamplesPage from "../Pages/SamplesPage";
import UserActivities from "../Pages/UserActivities";

import { app_routes } from "../utils/constants";

export const router = createBrowserRouter([
  // { path: app_routes.login, element: <LoginForm /> },

  {
    path: app_routes.root,
    // element: <ProtectedRoute />, // Wrap all dashboard routes
    children: [
      {
        element: <DashboardLayout />, // Layout inside protected route
        children: [
          { index: true, element: <DashboardHome /> },
          // { path: app_routes.samples, element: <SamplesPage /> },
          // { path: app_routes.user_activities, element: <UserActivities /> },
        ],
      },
    ],
  },
]);
