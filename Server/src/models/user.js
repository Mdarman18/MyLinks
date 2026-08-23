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
  category: {
    type: String,
    enum: ["dev", "salesforce", "learning", "design", "social", "other"],
    default: "other",
  },
});

export const userDetails = mongoose.model("User", appSchema);
