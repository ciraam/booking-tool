import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bookings: [],
  currentBooking: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    addBooking: (state, action) => {
      state.bookings.push(action.payload);
    },
    removeBooking: (state, action) => {
      state.bookings = state.bookings.filter(b => b.id !== action.payload);
    },
    updateBooking: (state, action) => {
      const index = state.bookings.findIndex(b => b.id === action.payload.id);
      if (index !== -1) state.bookings[index] = action.payload;
    },
    setBookings: (state, action) => {
      state.bookings = action.payload;
    },
  },
});

export const { addBooking, removeBooking, updateBooking, setBookings } = bookingSlice.actions;
export default bookingSlice.reducer;