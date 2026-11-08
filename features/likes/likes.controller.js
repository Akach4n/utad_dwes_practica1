import mongoose from "mongoose";
import Like from "./likes.model.js";

// Devuelve todos los likes
export const getLikes = async (req, res) => {
  try {
    const likes = await Like.find();
    res.json(likes);
  } catch (err) {
    res.status(500).json({ error: "Error fetching likes" });
  }
};

// Devuelve un like por su ID
export const getLike = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid like ID" });
    }
    const like = await Like.findById(req.params.id);
    if (!like) {
      return res.status(404).json({ error: "Like not found" });
    }
    res.json(like);
  } catch (err) {
    res.status(500).json({ error: "Error fetching like" });
  }
};

// Crea un like con los datos del body
export const createLike = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Missing like data" });
    }
    const like = await Like.create(req.body);
    res.status(201).json(like);
  } catch (err) {
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({ error: "Invalid like data" });
    }
    res.status(500).json({ error: "Error creating like" });
  }
};

// Actualiza un like por su ID
export const updateLike = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid like ID" });
    }
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Missing like data" });
    }
    const like = await Like.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after", runValidators: true });
    if (!like) {
      return res.status(404).json({ error: "Like not found" });
    }
    res.json(like);
  } catch (err) {
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({ error: "Invalid like data" });
    }
    res.status(500).json({ error: "Error updating like" });
  }
};

// Elimina un like por su ID
export const deleteLike = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid like ID" });
    }
    const like = await Like.findByIdAndDelete(req.params.id);
    if (!like) {
      return res.status(404).json({ error: "Like not found" });
    }
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: "Error deleting like" });
  }
};
