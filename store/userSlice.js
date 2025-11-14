import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  currentUser: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    removeUser: (state, action) => {
      state.users = state.users.filter(b => b.id !== action.payload);
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(b => b.id === action.payload.id);
      if (index !== -1) state.users[index] = action.payload;
    },
    setUser: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const { addUser, removeUser, updateUser, setUser } = userSlice.actions;
export default userSlice.reducer;