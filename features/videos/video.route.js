import { Router } from "express";

import { getVideos, getVideo, createVideo, updateVideo, deleteVideo } from "./video.controller.js";

const router = Router();

router.get("/", getVideos);
router.get("/:id", getVideo);
router.post("/", createVideo);
router.put("/:id", updateVideo);
router.delete("/:id", deleteVideo);

export default router;
