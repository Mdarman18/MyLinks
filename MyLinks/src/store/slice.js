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
    updateItem: (state, action) => {
      const updatedItem = action.payload;
      const targetId = updatedItem._id || updatedItem.id;

      state.user = state.user.map((ele) => {
        const currentId = ele._id || ele.id;
        return currentId === targetId ? updatedItem : ele;
      });
    },
  },
});

export const { setUser, clearUser, deleteUser, togglePin, updateItem } =
  userSlice.actions;

export default userSlice.reducer;
