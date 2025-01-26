import { configureStore } from '@reduxjs/toolkit';
import serviceReducer from './slices/serviceSlice';
import userReducer from './slices/userSlice';
import requestDraftSlice from './slices/requestDraftSlice';
export const store = configureStore({
  reducer: {
    services: serviceReducer,
    user: userReducer,
    requestDraftSlice : requestDraftSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
