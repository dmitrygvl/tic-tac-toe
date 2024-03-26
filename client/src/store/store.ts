import { configureStore } from '@reduxjs/toolkit';
import connectionReducer from './slices/connectionSlice';
import userReducer from './slices/userSlice';
import roomsReducer from './slices/roomsSlice';
import roomReducer from './slices/roomSlice';
import endGameReducer from './slices/endGameSlice';
import offerAndAgreementReducer from './slices/offerAndAgreementSlice';
import leaverNameReducer from './slices/leaverNameSlice';

const store = configureStore({
  reducer: {
    connection: connectionReducer,
    user: userReducer,
    rooms: roomsReducer,
    room: roomReducer,
    endGame: endGameReducer,
    offerAndAgreement: offerAndAgreementReducer,
    leaverName: leaverNameReducer,
  },
});

export type Store = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
