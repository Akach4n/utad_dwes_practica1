import mongoose from "mongoose";
import Comment from "./comments.model.js";

// Devuelve todos los comentarios
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Error fetching comments" });
  }
};

// Devuelve un comentario por su ID
export const getComment = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid comment ID" });
    }
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: "Error fetching comment" });
  }
};

// Crea un comentario con los datos del body
export const createComment = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Missing comment data" });
    }
    const comment = await Comment.create(req.body);
    res.status(201).json(comment);
  } catch (err) {
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({ error: "Invalid comment data" });
    }
    res.status(500).json({ error: "Error creating comment" });
  }
};

// Actualiza un comentario por su ID
export const updateComment = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid comment ID" });
    }
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Missing comment data" });
    }
    const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after", runValidators: true });
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res.json(comment);
  } catch (err) {
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({ error: "Invalid comment data" });
    }
    res.status(500).json({ error: "Error updating comment" });
  }
};

// Elimina un comentario por su ID
export const deleteComment = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid comment ID" });
    }
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: "Error deleting comment" });
  }
};
