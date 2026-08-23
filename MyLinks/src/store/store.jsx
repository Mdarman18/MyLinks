import { configureStore } from "@reduxjs/toolkit";
import storageModule from "redux-persist/lib/storage";
const storage = storageModule.default || storageModule;
import { persistStore, persistReducer } from "redux-persist";
import userReducer from "./slice";

const persistConfig = {
  key: "root",
  storage,
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
