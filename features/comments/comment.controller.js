import Comment from "./comment.model.js";
import Video from "../videos/video.model.js";
import { canWatch } from "../../utils/helpers.js";
import { loadComment } from "./comment.helper.js";

// Devuelve todos los comentarios, con sus respuestas si load es full
export async function getComments(req, res, next) {
	try {
		const load = req.query.load || "lazy";
		if (load !== "lazy" && load !== "full") return res.status(400).json({ error: "load must be lazy or full" });

		const comments = await Comment.find().populate("user");
		const result = await Promise.all(comments.map((c) => loadComment(c, load === "full")));
		res.json(result);
	} catch (error) {
		next(error);
	}
}

// Devuelve un comentario, con sus respuestas si load es full
export async function getComment(req, res, next) {
	try {
		const load = req.query.load || "lazy";
		if (load !== "lazy" && load !== "full") return res.status(400).json({ error: "load must be lazy or full" });

		const comment = await Comment.findById(req.params.id).populate("user");
		if (!comment) return res.status(404).json({ error: "Comment not found" });
		res.json(await loadComment(comment, load === "full"));
	} catch (error) {
		next(error);
	}
}

// Crea un comentario tras comprobar el vídeo, la edad y el comentario padre
export async function createComment(req, res, next) {
	try {
		const { text, video, parent } = req.body;
		const user = req.requester._id;
		const videoCheck = await Video.findById(video);
		if (!videoCheck) return res.status(404).json({ error: "Video not found to create a comment" });
		if (!canWatch(req.requester, videoCheck)) return res.status(403).json({ error: "Age restriction" });
		if (parent) {
			const parentCheck = await Comment.findById(parent);
			if (!parentCheck) return res.status(404).json({ error: "Parent comment not found" });
			if (parentCheck.video.toString() !== video) {
				return res.status(400).json({ error: "The parent comment belongs to another video" });
			}
		}
		const comment = await Comment.create({ text, user, video, parent });
		res.status(201).json(comment);
	} catch (error) {
		next(error);
	}
}

// Modifica solo el texto de un comentario
export async function updateComment(req, res, next) {
	try {
		const { text } = req.body;
		const newComment = { text };
		const comment = await Comment.findByIdAndUpdate(req.params.id, newComment, {
			returnDocument: "after",
			runValidators: true,
		});
		if (!comment) return res.status(404).json({ error: "Couldn't update the comment" });
		res.json(comment);
	} catch (error) {
		next(error);
	}
}

// Borra un comentario por id
export async function deleteComment(req, res, next) {
	try {
		const comment = await Comment.findByIdAndDelete(req.params.id);
		if (!comment) return res.status(404).json({ error: "Comment not found" });
		res.status(204).end();
	} catch (error) {
		next(error);
	}
}
