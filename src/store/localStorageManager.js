// localStorageStorageManager.js
import { SESSION_KEYS } from "../utils/constants";

export const LocalStorageManager = {
  setSessionData: (data) => {
    localStorage.setItem(SESSION_KEYS.USER(), JSON.stringify(data.user));
    localStorage.setItem(
      SESSION_KEYS.AT(),
      JSON.stringify(data.token.accessToken)
    );
    localStorage.setItem(
      SESSION_KEYS.RT(),
      JSON.stringify(data.token.refreshToken)
    );
  },
  getUser: () => {
    const user = localStorage.getItem(SESSION_KEYS.USER());
    return user ? JSON.parse(user) : null;
  },
  getAccessSESSION: () => {
    const token = localStorage.getItem(SESSION_KEYS.AT());
    return token ? JSON.parse(token) : null;
  },
  getRefreshSESSION: () => {
    const token = localStorage.getItem(SESSION_KEYS.RT());
    return token ? JSON.parse(token) : null;
  },
  setAccessSESSION: (token) =>
    localStorage.setItem(SESSION_KEYS.AT(), JSON.stringify(token)),
  setRefreshSESSION: (token) =>
    localStorage.setItem(SESSION_KEYS.RT(), JSON.stringify(token)),
  logout: () => localStorage.clear(),
};
