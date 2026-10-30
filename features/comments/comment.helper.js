import Comment from "./comment.model.js";
import Like from "../likes/like.model.js";

// Añade los likes a un comentario y carga sus respuestas de forma recursiva si full es true
export async function loadComment(comment, full) {
	const likesCount = await Like.countDocuments({ comment: comment._id });
	const result = { ...comment.toObject(), likesCount };

	if (full) {
		const replies = await Comment.find({ parent: comment._id }).populate("user");
		result.replies = await Promise.all(replies.map((r) => loadComment(r, true)));
	}

	return result;
}
