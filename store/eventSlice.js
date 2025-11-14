import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  events: [],
  currentEvent: null,
};

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setEvents: (state, action) => {
      state.events = action.payload;
    },
    setCurrentEvent: (state, action) => {
      state.currentEvent = action.payload;
    },
    updateEvent: (state, action) => {
      const index = state.events.findIndex(e => e.event_id === action.payload.event_id);
      if (index !== -1) state.events[index] = action.payload;
    },
  },
});

export const { setEvents, setCurrentEvent, updateEvent } = eventSlice.actions;
export default eventSlice.reducer;