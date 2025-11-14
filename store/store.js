import { configureStore } from '@reduxjs/toolkit';
import bookingReducer from './bookingSlice';
import eventReducer from './eventSlice';

export const store = configureStore({
  reducer: {
    booking: bookingReducer,
    event: eventReducer,
  },
});