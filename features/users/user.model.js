import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		userName: { type: String, required: true, unique: true, trim: true },
		fullName: { type: String, trim: true },
		description: { type: String, maxlength: 500 },
		email: { type: String, required: true, unique: true, lowercase: true, trim: true },
		// Queda fuera de las consultas para que nunca llegue a una respuesta
		password: { type: String, required: true, select: false },
		birthDate: { type: Date, required: true },
	},
	{ timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
