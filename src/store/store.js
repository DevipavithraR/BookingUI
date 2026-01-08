import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slicers/authSlicer";
import themeReducer from "./slicers/themeSlice";
import sidebarReducer from "./slicers/sideBarSlicer";

// for persistent storage
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Persist configs
const persistConfigs = {
  auth: {
    key: "auth",
    storage,
  },
  // Removed missing configs
};

const persistedSlices = {
  auth: persistReducer(persistConfigs.auth, authReducer),
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    sidebar: sidebarReducer,
    ...persistedSlices,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export const dispatch = store.dispatch;

export default store;
