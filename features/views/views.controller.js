import mongoose from "mongoose";
import View from "./views.model.js";

// Devuelve todas las visualizaciones
export const getViews = async (req, res) => {
  try {
    const views = await View.find();
    res.json(views);
  } catch (err) {
    res.status(500).json({ error: "Error fetching views" });
  }
};

// Devuelve una visualización por su ID
export const getView = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid view ID" });
    }
    const view = await View.findById(req.params.id);
    if (!view) {
      return res.status(404).json({ error: "View not found" });
    }
    res.json(view);
  } catch (err) {
    res.status(500).json({ error: "Error fetching view" });
  }
};

// Crea una visualización con los datos del body
export const createView = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Missing view data" });
    }
    const view = await View.create(req.body);
    res.status(201).json(view);
  } catch (err) {
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({ error: "Invalid view data" });
    }
    res.status(500).json({ error: "Error creating view" });
  }
};

// Actualiza una visualización por su ID
export const updateView = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid view ID" });
    }
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Missing view data" });
    }
    const view = await View.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after", runValidators: true });
    if (!view) {
      return res.status(404).json({ error: "View not found" });
    }
    res.json(view);
  } catch (err) {
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({ error: "Invalid view data" });
    }
    res.status(500).json({ error: "Error updating view" });
  }
};

// Elimina una visualización por su ID
export const deleteView = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid view ID" });
    }
    const view = await View.findByIdAndDelete(req.params.id);
    if (!view) {
      return res.status(404).json({ error: "View not found" });
    }
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: "Error deleting view" });
  }
};
