import mongoose from "mongoose";
import User from "../features/users/user.model.js";

// Lee la cabecera x-user-id, comprueba que el usuario existe y lo guarda en req.requester
export async function requester(req, res, next) {
	try {
		const id = req.headers["x-user-id"];
		if (!id) return res.status(400).json({ error: "Requested header not found" });
		if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "Invalid objectId" });
		const user = await User.findById(id);
		if (!user) return res.status(404).json({ error: "User not found" });
		req.requester = user;
		next();
	} catch (error) {
		next(error);
	}
}
