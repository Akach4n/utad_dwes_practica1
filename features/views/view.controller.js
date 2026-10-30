import View, { startOfDay } from "./view.model.js";
import Video from "../videos/video.model.js";

// Devuelve todas las visualizaciones con su usuario y su vídeo
export async function getViews(_req, res, next) {
	try {
		const views = await View.find().populate(["user", "video"]);
		res.json(views);
	} catch (error) {
		next(error);
	}
}

// Devuelve una visualización con su usuario y su vídeo
export async function getView(req, res, next) {
	try {
		const view = await View.findById(req.params.id).populate(["user", "video"]);
		if (!view) return res.status(404).json({ error: "View not found" });
		res.json(view);
	} catch (error) {
		next(error);
	}
}

// Registra una visualización a mano y el índice único rechaza una segunda el mismo día
export async function createView(req, res, next) {
	try {
		const { video } = req.body;
		if (!video) return res.status(400).json({ error: "Video is required" });
		const user = req.requester._id;
		const videoCheck = await Video.findById(video);
		if (!videoCheck) return res.status(404).json({ error: "Video not found" });
		if (!canWatch(req.requester, videoCheck)) return res.status(403).json({ error: "Age restriction" });
		const view = await View.create({ user, video });
		res.status(201).json(view);
	} catch (error) {
		next(error);
	}
}

// Cambia el día de una visualización y lo deja a medianoche
export async function updateView(req, res, next) {
	try {
		const { day } = req.body;
		if (!day) return res.status(400).json({ error: "Day is required" });
		const newDay = new Date(day);
		if (isNaN(newDay)) return res.status(400).json({ error: "Day is not a valid date" });
		const view = await View.findByIdAndUpdate(
			req.params.id,
			{ day: startOfDay(newDay) },
			{ returnDocument: "after", runValidators: true },
		);
		if (!view) return res.status(404).json({ error: "View not found to update" });
		res.json(view);
	} catch (error) {
		next(error);
	}
}

// Borra una visualización por id
export async function deleteView(req, res, next) {
	try {
		const view = await View.findByIdAndDelete(req.params.id);
		if (!view) return res.status(404).json({ error: "View not found to delete" });
		res.status(204).end();
	} catch (error) {
		next(error);
	}
}
