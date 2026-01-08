// reduxStorageManager.js
import { store } from "./store";
import {
  logout,
  selectAccessToken,
  selectRefreshToken,
  setSessionData,
  updateAccessToken,
  updateRefreshToken,
} from "./slicers/authSlicer";

const listeners = new Set();
export const ReduxStorageManager = {
  setSessionData: (userSession) => store.dispatch(setSessionData(userSession)),
  getUser: () => selectAccessToken(store.getState()),
  getAccessToken: () => selectAccessToken(store.getState()),
  getRefreshToken: () => selectRefreshToken(store.getState()),
  setAccessToken: (token) => store.dispatch(updateAccessToken(token)),
  setRefreshToken: (token) => store.dispatch(updateRefreshToken(token)),
  logout: () => store.dispatch(logout()),

  setMaterials: (data) => {
    store.dispatch(setData(data));
  },
  getMaterials: () => getData(store.getState()),

  setItem: (data) => {
    store.dispatch(setItem(data));
    // Notify all listeners when setItem is called
    listeners.forEach((cb) => cb(data));
  },
  getItem: () => getItem(store.getState()),
  // New subscription methods
  subscribe: (callback) => {
    listeners.add(callback);
    // Return an unsubscribe function
    return () => listeners.delete(callback);
  },
};
