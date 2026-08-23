import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    setUser: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.user = action.payload;
      } else if (action.payload) {
        const currentList = Array.isArray(state.user) ? state.user : [];
        state.user = [...currentList, action.payload];
      }
    },

    clearUser: (state) => {
      state.user = null;
    },
    deleteUser: (state, action) => {
      state.user = state.user.filter((ele) => ele._id !== action.payload);
    },
  },
});

export const { setUser, clearUser, deleteUser } = userSlice.actions;

export default userSlice.reducer;
