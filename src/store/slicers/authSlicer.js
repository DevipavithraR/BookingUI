import { createSlice } from "@reduxjs/toolkit";
import { getRoutesForRoles } from "../../routes/roleStrategies";
import { ROLES } from "../../utils/constants";
const initialState = {
  user: null,
  token: {
    accessToken: null,
    refreshToken: null,
  },
  allowedRoutes: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSessionData: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.allowedRoutes = getRoutesForRoles(user?.roles || []);
    },

    // Update only access token
    updateAccessToken: (state, action) => {
      state.token.accessToken = action.payload;
    },

    // Update only refresh token
    updateRefreshToken: (state, action) => {
      state.token.refreshToken = action.payload;
    },

    // Clear user data on logout
    logout: (state) => {
      state.user = null;
      state.token = { accessToken: null, refreshToken: null };
    },
  },
});

export const { setSessionData, updateAccessToken, updateRefreshToken, logout } =
  authSlice.actions;

export const selectAuthData = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const isAdmin = (state) => {
  const roles = state.auth.user?.roles ?? [];
  return roles.map((r) => r.toLowerCase()).includes(ROLES.ADMIN.toLowerCase());
};

export const isClient = (state) => {
  const roles = state.auth.user?.roles ?? [];
  return roles.map((r) => r.toLowerCase()).includes(ROLES.CLIENT.toLowerCase());
};
export const selectAccessToken = (state) => state.auth.token.accessToken;
export const selectRefreshToken = (state) => state.auth.token.refreshToken;

export default authSlice.reducer;
