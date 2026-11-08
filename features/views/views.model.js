import mongoose from "mongoose";

const viewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  video: { type: mongoose.Schema.Types.ObjectId, ref: "Video" },
  day: { type: Date, default: Date.now },
}, { timestamps: true });

const View = mongoose.model("View", viewSchema);

export default View;
