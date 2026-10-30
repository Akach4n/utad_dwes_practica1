import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
	{
		text: { type: String, required: true, maxlength: 255 },
		publishedAt: { type: Date, default: Date.now },
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		video: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Video",
			required: true,
		},
		// Es null en los comentarios principales y en las respuestas apunta al comentario original
		parent: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment",
			default: null,
		},
	},
	{ timestamps: true },
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
