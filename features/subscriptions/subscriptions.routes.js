import { Router } from "express";
import { getSubscriptions, getSubscription, createSubscription, updateSubscription, deleteSubscription } from "./subscriptions.controller.js";

const router = Router();

router.get("/", getSubscriptions);
router.get("/:id", getSubscription);
router.post("/", createSubscription);
router.put("/:id", updateSubscription);
router.delete("/:id", deleteSubscription);

export default router;
