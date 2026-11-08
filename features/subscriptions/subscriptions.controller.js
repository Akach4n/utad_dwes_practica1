import mongoose from "mongoose";
import Subscription from "./subscriptions.model.js";

// Devuelve todas las suscripciones
export const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({ error: "Error fetching subscriptions" });
  }
};

// Devuelve una suscripción por su ID
export const getSubscription = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid subscription ID" });
    }
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    res.json(subscription);
  } catch (err) {
    res.status(500).json({ error: "Error fetching subscription" });
  }
};

// Crea una suscripción con los datos del body
export const createSubscription = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Missing subscription data" });
    }
    const subscription = await Subscription.create(req.body);
    res.status(201).json(subscription);
  } catch (err) {
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({ error: "Invalid subscription data" });
    }
    res.status(500).json({ error: "Error creating subscription" });
  }
};

// Actualiza una suscripción por su ID
export const updateSubscription = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid subscription ID" });
    }
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Missing subscription data" });
    }
    const subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after", runValidators: true });
    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    res.json(subscription);
  } catch (err) {
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({ error: "Invalid subscription data" });
    }
    res.status(500).json({ error: "Error updating subscription" });
  }
};

// Elimina una suscripción por su ID
export const deleteSubscription = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid subscription ID" });
    }
    const subscription = await Subscription.findByIdAndDelete(req.params.id);
    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: "Error deleting subscription" });
  }
};
