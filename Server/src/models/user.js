import mongoose from "mongoose";

const appSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  url: {
    type: String,
  },

  description: {
    type: String,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
});

export const userDetails = mongoose.model("User", appSchema);
