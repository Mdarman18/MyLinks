import express from "express";
import {
  handleAdd,
  handleDelete,
  handleGet,
  handlePinnote,
  handleUpdate,
} from "../controllers/control.js";
export const route = express.Router();
route.post("/add", handleAdd);
route.delete("/delete/:id", handleDelete);
route.get("/get", handleGet);
route.put("/update/:id", handleUpdate);
route.post("/isPinned/:id", handlePinnote);
