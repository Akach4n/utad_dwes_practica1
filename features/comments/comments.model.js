import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: String,
  publishedAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  video: { type: mongoose.Schema.Types.ObjectId, ref: "Video" },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
}, { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
