import { userDetails } from "../models/user.js";
import customError from "../utlis/error.js";

// ======---------handle add detalis ----==========
export const handleAdd = async (req, res, next) => {
  try {
    const { title, url, description, category } = req.body;
    if (!title) {
      throw new customError("please enter the title", 400);
    }
    const result = await userDetails.create({
      title: title,
      url: url,
      description: description,
      category: category,
    });
    res.status(201).json({
      success: true,
      message: "The record is save successfully",
      user: result,
    });
  } catch (error) {
    next(error);
  }
};

// =====------- Handle delete ----==============
export const handleDelete = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await userDetails.findByIdAndDelete(id);
    res.status(201).json({
      success: true,
      message: "The record is deleted successfully",
      user: result,
    });
  } catch (error) {
    next(error);
  }
};

// =====--- Handle get allUserDetalis ----==========
export const handleGet = async (req, res, next) => {
  try {
    const get = await userDetails.find().sort({ isPinned: -1 });
    res.status(201).json({
      success: true,
      message: "All records fetched",
      user: get,
    });
  } catch (error) {
    next(error);
  }
};

// =======-----------Handle update ===========----------------
export const handleUpdate = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, url } = req.body;

  try {
    const result = await userDetails.findById(id);

    if (!result) {
      throw new customError("The record is not found", 404);
    }

    if (title !== undefined) {
      result.title = title;
    }

    if (description !== undefined) {
      result.description = description;
    }

    if (url !== undefined) {
      result.url = url;
    }

    await result.save();

    res.status(200).json({
      success: true,
      message: "Record updated successfully",
      user: result,
    });
  } catch (error) {
    next(error);
  }
};

// =======--------- Handle pinnote --------===========
export const handlePinnote = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await userDetails.findById(id);
    if (!result) {
      throw new customError("The record is not found", 404);
    }
    result.isPinned = !result.isPinned;

    await result.save();

    res.status(200).json({
      success: true,
      message: result.isPinned
        ? "Note pinned successfully"
        : "Note unpinned successfully",
      user: result,
    });
  } catch (error) {
    next(error);
  }
};
