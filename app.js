import express from "express";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middlewares/errorHandler.js";

import userRoute from "./features/users/user.route.js";
import videosRoute from "./features/videos/video.route.js";
import commentsRoute from "./features/comments/comment.route.js";
import likesRoute from "./features/likes/like.route.js";
import subscriptionsRoute from "./features/subscriptions/subscription.route.js";
import viewsRoute from "./features/views/view.route.js";
import feedRoute from "./features/feed/feed.route.js";
import { requester } from "./middlewares/requester.js";

const app = express();

app.use(express.json());
app.use("/users", userRoute);
// Estas rutas necesitan saber quién hace la petición
app.use("/videos", requester, videosRoute);
app.use("/comments", requester, commentsRoute);
app.use("/likes", requester, likesRoute);
app.use("/subscriptions", subscriptionsRoute);
app.use("/views", requester, viewsRoute);
app.use("/feed", requester, feedRoute);

app.get("/", (req, res) => {
	res.json({ msg: "Hello" });
});

// El manejador de errores va el último para recoger los errores de todas las rutas
app.use(errorHandler);
// Conecta con la base de datos antes de aceptar peticiones
await connectDB();

app.listen(process.env.PORT, () => console.log(`Server running at http://localhost:${process.env.PORT}`));
