import Video from "./video.model.js";
import User from "../users/user.model.js";
import Like from "../likes/like.model.js";
import Comment from "../comments/comment.model.js";
import { canWatch, isMinor } from "../../utils/helpers.js";
import View, { startOfDay } from "../views/view.model.js";
import { loadComment } from "../comments/comment.helper.js";

// Añade a un vídeo sus contadores de visualizaciones, likes y comentarios
async function withCounters(video) {
	const viewsCount = await View.countDocuments({ video: video._id });
	const likesCount = await Like.countDocuments({ video: video._id });
	const commentsCount = await Comment.countDocuments({ video: video._id });

	return { ...video.toObject(), viewsCount, likesCount, commentsCount };
}
// Añade los contadores a un vídeo y, si load es full, sus comentarios con sus respuestas
export async function prepareVideo(video, load) {
	const result = await withCounters(video);

	if (load === "full") {
		const comments = await Comment.find({ video: video._id, parent: null }).populate("user");
		result.comments = await Promise.all(comments.map((c) => loadComment(c, true)));
	}

	return result;
}

// Devuelve todos los vídeos que puede ver el usuario
export async function getVideos(req, res, next) {
	try {
		const load = req.query.load || "lazy";
		if (load !== "lazy" && load !== "full") return res.status(400).json({ error: "load must be lazy or full" });

		const filter = isMinor(req.requester.birthDate) ? { kidsFriendly: true } : {};
		const videos = await Video.find(filter).populate("user");
		const result = await Promise.all(videos.map((v) => prepareVideo(v, load)));
		res.json(result);
	} catch (error) {
		next(error);
	}
}

// Devuelve un vídeo y registra la visualización de hoy del usuario
export async function getVideo(req, res, next) {
	try {
		const load = req.query.load || "lazy";
		if (load !== "lazy" && load !== "full") return res.status(400).json({ error: "load must be lazy or full" });

		const video = await Video.findById(req.params.id).populate("user");
		if (!video) return res.status(404).json({ error: "Video not found" });
		if (!canWatch(req.requester, video)) return res.status(403).json({ error: "Age restriction" });

		await View.updateOne(
			{ user: req.requester._id, video: video._id, day: startOfDay() },
			{ $setOnInsert: { user: req.requester._id, video: video._id, day: startOfDay() } },
			{ upsert: true },
		);

		res.json(await prepareVideo(video, load));
	} catch (error) {
		next(error);
	}
}

// Crea un vídeo tras comprobar que su autor existe
export async function createVideo(req, res, next) {
	try {
		const { title, description, thumbnail, url, kidsFriendly, user } = req.body;
		const userCheck = await User.findById(req.body.user);
		if (!userCheck) return res.status(404).json({ error: "User not found to create a video" });
		const video = await Video.create({
			title,
			description,
			thumbnail,
			url,
			kidsFriendly,
			user,
		});
		res.status(201).json(video);
	} catch (error) {
		next(error);
	}
}

// Modifica un vídeo sin poder cambiar su autor
export async function updateVideo(req, res, next) {
	try {
		const { title, description, thumbnail, url, kidsFriendly } = req.body;

		const newVideo = { title, description, thumbnail, url, kidsFriendly };

		const video = await Video.findByIdAndUpdate(req.params.id, newVideo, {
			returnDocument: "after",
			runValidators: true,
		});
		if (!video) return res.status(404).json({ error: "Couldn't update the video" });
		res.json(video);
	} catch (error) {
		next(error);
	}
}

// Borra un vídeo por id
export async function deleteVideo(req, res, next) {
	try {
		const video = await Video.findByIdAndDelete(req.params.id);
		if (!video) return res.status(404).json({ error: "Video not found to delete" });
		res.status(204).end();
	} catch (error) {
		next(error);
	}
}
