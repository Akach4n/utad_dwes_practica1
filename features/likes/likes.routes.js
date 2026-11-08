import { Router } from "express";
import { getLikes, getLike, createLike, updateLike, deleteLike } from "./likes.controller.js";

const router = Router();

router.get("/", getLikes);
router.get("/:id", getLike);
router.post("/", createLike);
router.put("/:id", updateLike);
router.delete("/:id", deleteLike);

export default router;
