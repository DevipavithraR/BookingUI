// roleStrategies.js
import { app_routes } from "../utils/constants";

export const ROUTES_FOR_CLIENT = [
  app_routes.root, // Dashboard
  // app_routes.samples, // Samples
];
export const ROUTES_FOR_ADMIN = ["*"];

export const roleStrategies = {
  Client: () => ROUTES_FOR_CLIENT,
  Admin: () => ROUTES_FOR_ADMIN,
};

export const getRoutesForRoles = (roles = []) => {
  const routesSet = new Set();
  roles.forEach((role) => {
    if (roleStrategies[role]) {
      roleStrategies[role]().forEach((route) => routesSet.add(route));
    }
  });
  return Array.from(routesSet);
};