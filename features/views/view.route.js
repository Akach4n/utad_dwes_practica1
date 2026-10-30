import { Router } from "express";
import { getViews, getView, createView, updateView, deleteView } from "./view.controller.js";

const router = Router();

router.get("/", getViews);
router.get("/:id", getView);
router.post("/", createView);
router.put("/:id", updateView);
router.delete("/:id", deleteView);

export default router;