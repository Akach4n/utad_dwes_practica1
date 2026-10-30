import Subscription from "../subscriptions/subscription.model.js";
import { isMinor } from "../../utils/helpers.js";
import Video from "../videos/video.model.js";
import { prepareVideo } from "../videos/video.controller.js";

// Devuelve los vídeos más recientes, filtrados por suscripciones si sub es true y por edad si es menor
export async function getFeed(req, res, next) {
	try {
		const sub = req.query.sub;
		if (sub !== "true" && sub !== "false") return res.status(400).json({ error: "Wrong parameters" });
		const filter = {};
		if (isMinor(req.requester.birthDate)) {
			filter.kidsFriendly = true;
		}

		if (sub === "true") {
			const subscriptions = await Subscription.find({ subscriber: req.requester._id });
			const channels = subscriptions.map((s) => s.channel);
			filter.user = { $in: channels };
		}

		const videos = await Video.find(filter).populate("user").sort({ publishedAt: -1 });
		const result = await Promise.all(videos.map((v) => prepareVideo(v, "lazy")));
		res.json(result);
	} catch (error) {
		next(error);
	}
}
