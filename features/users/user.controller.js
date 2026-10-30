import bcrypt from "bcryptjs";
import User from "./user.model.js";

// Devuelve todos los usuarios
export async function getUsers(req, res, next) {
	try {
		const users = await User.find();
		res.json(users);
	} catch (error) {
		next(error);
	}
}
// Devuelve un usuario por id
export async function getUserById(req, res, next) {
	try {
		const user = await User.findById(req.params.id);
		if (!user) return res.status(404).json({ error: "User not found" });
		res.json(user);
	} catch (error) {
		next(error);
	}
}

// Crea un usuario con la contraseña hasheada y la quita de la respuesta
export async function createUser(req, res, next) {
	try {
		const { userName, fullName, description, email, password, birthDate } = req.body;
		const hash = await bcrypt.hash(password, 10);
		const user = await User.create({
			userName,
			fullName,
			description,
			email,
			password: hash,
			birthDate,
		});
		const { password: _, ...userWithoutPassword } = user.toObject();
		res.status(201).json(userWithoutPassword);
	} catch (error) {
		next(error);
	}
}
// Modifica un usuario y hashea la contraseña solo si llega una nueva
export async function updateUser(req, res, next) {
	try {
		const { userName, fullName, description, email, password, birthDate } = req.body;
		const data = { userName, fullName, description, email, birthDate };
		if (password) data.password = await bcrypt.hash(password, 10);

		const user = await User.findByIdAndUpdate(req.params.id, data, { returnDocument: "after", runValidators: true });
		if (!user) return res.status(404).json({ error: "Couldn't update the user" });
		res.json(user);
	} catch (error) {
		next(error);
	}
}

// Borra un usuario por id
export async function deleteUser(req, res, next) {
	try {
		const user = await User.findByIdAndDelete(req.params.id);
		if (!user) return res.status(404).json({ error: "User not found to delete" });
		res.status(204).end();
	} catch (error) {
		next(error);
	}
}
