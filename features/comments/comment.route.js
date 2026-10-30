import { Router } from "express";
import { getComments, getComment, createComment, updateComment, deleteComment } from "./comment.controller.js";
const router = Router();

router.get("/", getComments);
router.get("/:id", getComment);
router.post("/", createComment);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

export default router;
