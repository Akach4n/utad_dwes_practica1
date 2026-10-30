import mongoose from "mongoose";

// Conecta con MongoDB usando la URI del entorno
export async function connectDB() {
	await mongoose.connect(process.env.MONGODB_URI);
	console.log("Connected to MongoDB");
}