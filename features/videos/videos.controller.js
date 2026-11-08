import mongoose from "mongoose";
import Video from "./videos.model.js";

// Devuelve todos los vídeos
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: "Error fetching videos" });
  }
};

// Devuelve un vídeo por su ID
export const getVideo = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid video ID" });
    }
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: "Error fetching video" });
  }
};

// Crea un vídeo con los datos del body
export const createVideo = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Missing video data" });
    }
    const video = await Video.create(req.body);
    res.status(201).json(video);
  } catch (err) {
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({ error: "Invalid video data" });
    }
    res.status(500).json({ error: "Error creating video" });
  }
};

// Actualiza un vídeo por su ID
export const updateVideo = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid video ID" });
    }
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Missing video data" });
    }
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after", runValidators: true });
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.json(video);
  } catch (err) {
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({ error: "Invalid video data" });
    }
    res.status(500).json({ error: "Error updating video" });
  }
};

// Elimina un vídeo por su ID
export const deleteVideo = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid video ID" });
    }
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: "Error deleting video" });
  }
};
