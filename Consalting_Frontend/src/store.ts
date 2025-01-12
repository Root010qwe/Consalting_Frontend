import { configureStore } from '@reduxjs/toolkit';
import servicesReducer from './slices/serviceSlice';

const store = configureStore({
  reducer: {
    services: servicesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
