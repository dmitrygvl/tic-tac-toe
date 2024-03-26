import { configureStore } from '@reduxjs/toolkit';
import roomsReducer from './slices/roomsSlice.js';
import usersReducer from './slices/usersSlice.js';

const store = configureStore({
  reducer: {
    rooms: roomsReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
