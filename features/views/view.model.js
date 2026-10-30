import mongoose from "mongoose";

// Devuelve la fecha a las 00:00 UTC para que dos visitas del mismo día den el mismo valor
export function startOfDay(date = new Date()) {
	const day = new Date(date);
	day.setUTCHours(0, 0, 0, 0);
	return day;
}

const viewSchema = new mongoose.Schema(
	{
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
		day: {
			type: Date,
			default: () => startOfDay(),
		},
	},
	{ timestamps: true },
);

// Un usuario solo cuenta como una visualización por vídeo y día
viewSchema.index({ user: 1, video: 1, day: 1 }, { unique: true });

const View = mongoose.model("View", viewSchema);

export default View;
