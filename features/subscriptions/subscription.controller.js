import Subscription from "./subscription.model.js";
import User from "../users/user.model.js";

// Devuelve todas las suscripciones con sus dos usuarios
export async function getSubscriptions(_req, res, next) {
	try {
		const subscriptions = await Subscription.find().populate(["subscriber", "channel"]);
		res.json(subscriptions);
	} catch (error) {
		next(error);
	}
}

// Devuelve una suscripción con sus dos usuarios
export async function getSubscription(req, res, next) {
	try {
		const subscription = await Subscription.findById(req.params.id).populate(["subscriber", "channel"]);
		if (!subscription) return res.status(404).json({ error: "Subscription not found" });
		res.json(subscription);
	} catch (error) {
		next(error);
	}
}

// Crea una suscripción tras comprobar que los dos usuarios existen y son distintos
export async function createSubscription(req, res, next) {
	try {
		const { subscriber, channel, reminder } = req.body;
		if (!subscriber || !channel) return res.status(400).json({ error: "Subscriber or channel not found in body" });
		if (subscriber.toString() === channel.toString()) {
			return res.status(400).json({ error: "Can't subscribe to your own channel" });
		}
		const subCheck = await User.findById(subscriber);
		if (!subCheck) return res.status(404).json({ error: "Subscriber not found" });
		const channelCheck = await User.findById(channel);
		if (!channelCheck) return res.status(404).json({ error: "Channel not found" });
		const subscription = await Subscription.create({ subscriber, channel, reminder });
		res.status(201).json(subscription);
	} catch (error) {
		next(error);
	}
}

// Modifica solo el recordatorio de una suscripción
export async function updateSubscription(req, res, next) {
	try {
		const { reminder } = req.body;
		if (reminder === undefined) return res.status(400).json({ error: "Reminder is required" });
		const subscription = await Subscription.findByIdAndUpdate(
			req.params.id,
			{ reminder },
			{ returnDocument: "after", runValidators: true },
		);
		if (!subscription) return res.status(404).json({ error: "Subscription not found to update" });
		res.json(subscription);
	} catch (error) {
		next(error);
	}
}

// Borra una suscripción por id
export async function deleteSubscription(req, res, next) {
	try {
		const subscription = await Subscription.findByIdAndDelete(req.params.id);
		if (!subscription) return res.status(404).json({ error: "Subscription not found to delete" });
		res.status(204).end();
	} catch (error) {
		next(error);
	}
}
