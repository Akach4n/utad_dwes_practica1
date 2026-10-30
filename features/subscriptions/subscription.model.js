import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
	{
		subscriber: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		channel: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		subscribedAt: {
			type: Date,
			default: Date.now,
		},
		reminder: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true },
);

// Un usuario solo puede suscribirse una vez a cada canal
subscriptionSchema.index({ subscriber: 1, channel: 1 }, { unique: true });



const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
