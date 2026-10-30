import Video from "../videos/video.model.js";
import Like from "./like.model.js";
import Comment from "../comments/comment.model.js";
import { canWatch } from "../../utils/helpers.js";

// Devuelve todos los likes con su usuario
export async function getLikes(_req, res, next) {
	try {
		const likes = await Like.find().populate("user");
		res.json(likes);
	} catch (error) {
		next(error);
	}
}
// Devuelve un like con su usuario
export async function getLike(req, res, next) {
	try {
		const like = await Like.findById(req.params.id).populate("user");
		if (!like) return res.status(404).json({ error: "Like not found" });
		res.json(like);
	} catch (error) {
		next(error);
	}
}

// Crea un like en un vídeo o comentario si el usuario tiene permiso para verlo
export async function createLike(req, res, next) {
	try {
		const { video, comment } = req.body;
		const user = req.requester._id;
		if ((video && comment) || (!video && !comment)) {
			return res.status(400).json({ error: "A like needs a video or a comment, but not both" });
		}
		if (video) {
			const videoCheck = await Video.findById(video);
			if (!videoCheck) return res.status(404).json({ error: "Video not found" });
			if (!canWatch(req.requester, videoCheck)) return res.status(403).json({ error: "Age restriction" });
		}
		if (comment) {
			const commentCheck = await Comment.findById(comment);
			if (!commentCheck) return res.status(404).json({ error: "Comment not found" });
			const commentVideo = await Video.findById(commentCheck.video);
			if (!canWatch(req.requester, commentVideo)) return res.status(403).json({ error: "Age restriction" });
		}
		const like = await Like.create({ user, video, comment });
		res.status(201).json(like);
	} catch (error) {
		next(error);
	}
}

// Mueve un like a otro vídeo o comentario y borra el anterior
export async function updateLike(req, res, next) {
	try {
		const { video, comment } = req.body;
		if ((video && comment) || (!video && !comment)) {
			return res.status(400).json({ error: "A like needs a video or a comment, but not both" });
		}
		if (video) {
			const videoCheck = await Video.findById(video);
			if (!videoCheck) return res.status(404).json({ error: "Video not found" });
			if (!canWatch(req.requester, videoCheck)) return res.status(403).json({ error: "Age restriction" });
		}
		if (comment) {
			const commentCheck = await Comment.findById(comment);
			if (!commentCheck) return res.status(404).json({ error: "Comment not found" });
			const commentVideo = await Video.findById(commentCheck.video);
			if (!canWatch(req.requester, commentVideo)) return res.status(403).json({ error: "Age restriction" });
		}
		const changes = video ? { $set: { video }, $unset: { comment: "" } } : { $set: { comment }, $unset: { video: "" } };

		const like = await Like.findByIdAndUpdate(req.params.id, changes, {
			returnDocument: "after",
			runValidators: true,
		});
		if (!like) return res.status(404).json({ error: "Like not found to update" });
		res.json(like);
	} catch (error) {
		next(error);
	}
}

// Borra un like por id
export async function deleteLike(req, res, next) {
	try {
		const like = await Like.findByIdAndDelete(req.params.id);
		if (!like) return res.status(404).json({ error: "Like not found to delete" });
		res.status(204).end();
	} catch (error) {
		next(error);
	}
}
