import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		video: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Video",
		},
		comment: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment",
		},
	},
	{ timestamps: true },
);

// Un usuario solo puede dar un like a cada vídeo
likeSchema.index({ user: 1, video: 1 }, { unique: true, partialFilterExpression: { video: { $type: "objectId" } } });

// Un usuario solo puede dar un like a cada comentario
likeSchema.index(
	{ user: 1, comment: 1 },
	{ unique: true, partialFilterExpression: { comment: { $type: "objectId" } } },
);

const Like = mongoose.model("Like", likeSchema);

export default Like;
