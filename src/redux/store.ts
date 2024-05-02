import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { apiSlice } from "./api";
import authReducer from "./features/auth/authSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
// import { productDetailApi } from "../features/common/products/services/noAuth/productDetailApi.ts";
// import productDataInAddProductReducer from "../features/vendor/redux/reducer/addProductSlice.ts";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  // blacklist: ["productInAddProduct", "productDetailApi", "api"], // add this line
  blacklist: ["api"], // add this line
};

const rootReducer = combineReducers({
  auth: authReducer,
  // productInAddProduct: productDataInAddProductReducer,
  // [productDetailApi.reducerPath]: productDetailApi.reducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false, // Add this line to disable immutableCheck
    }).concat([apiSlice.middleware]),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
