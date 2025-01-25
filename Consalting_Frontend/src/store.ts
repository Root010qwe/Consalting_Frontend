import { configureStore } from '@reduxjs/toolkit';
import serviceReducer from './slices/serviceSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    services: serviceReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
