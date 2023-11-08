import { configureStore } from '@reduxjs/toolkit';
import frameReducer from './frames';

const store = configureStore({
  reducer: {
    appointments: frameReducer
  }
});

export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
