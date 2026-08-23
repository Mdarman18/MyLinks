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
    togglePin: (state, action) => {
      const item = state.user.find(
        (item) => (item.id || item._id) === action.payload,
      );

      if (item) {
        item.isPinned = !item.isPinned;
      }
    },
  },
});

export const { setUser, clearUser, deleteUser ,togglePin} = userSlice.actions;

export default userSlice.reducer;
