import mongoose from "mongoose";
import User from "./users.model.js";

// Devuelve todos los usuarios
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

// Devuelve un usuario por su ID
export const getUser = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error fetching user" });
  }
};

// Crea un usuario con los datos del body
export const createUser = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Missing user data" });
    }
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({ error: "Invalid user data" });
    }
    res.status(500).json({ error: "Error creating user" });
  }
};

// Actualiza un usuario por su ID
export const updateUser = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Missing user data" });
    }
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after", runValidators: true });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({ error: "Invalid user data" });
    }
    res.status(500).json({ error: "Error updating user" });
  }
};

// Elimina un usuario por su ID
export const deleteUser = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: "Error deleting user" });
  }
};
