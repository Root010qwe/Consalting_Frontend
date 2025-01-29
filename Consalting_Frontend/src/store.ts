// Consalting_Frontend\src\store.ts
import { configureStore } from "@reduxjs/toolkit";
import serviceReducer from "./slices/serviceSlice";
import userReducer from "./slices/userSlice";
import requestDraftSlice from "./slices/requestDraftSlice";
import authFormsReducer from "./slices/authFormsSlice";
import requestSlice from "./slices/requestSlice";
import moderSlice from "./slices/moderSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    services: serviceReducer,
    user: userReducer,
    requestDraftSlice: requestDraftSlice,
    authForms: authFormsReducer, // добавляем новый редьюсер
    requests: requestSlice,
    moder: moderSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
