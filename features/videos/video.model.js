import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String, maxlength: 500 },
		thumbnail: { type: String },
		url: { type: String, required: true },
		publishedAt: { type: Date, default: Date.now },
		kidsFriendly: { type: Boolean, default: false },
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true },
);

const Video = mongoose.model("Video", videoSchema);

export default Video;
