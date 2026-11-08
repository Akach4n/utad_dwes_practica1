import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  thumbnail: String,
  url: String,
  publishedAt: { type: Date, default: Date.now },
  kidsFriendly: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const Video = mongoose.model("Video", videoSchema);

export default Video;
