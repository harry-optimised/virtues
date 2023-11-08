import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './profile';
import frameReducer from './frames';

const store = configureStore({
  reducer: {
    profile: profileReducer,
    appointments: frameReducer
  }
});

export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
