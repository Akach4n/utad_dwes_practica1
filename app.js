import express from "express";
import { connectDB } from "./config/db.js";
import usersRoutes from "./features/users/users.routes.js";
import videosRoutes from "./features/videos/videos.routes.js";
import commentsRoutes from "./features/comments/comments.routes.js";
import likesRoutes from "./features/likes/likes.routes.js";
import subscriptionsRoutes from "./features/subscriptions/subscriptions.routes.js";
import viewsRoutes from "./features/views/views.routes.js";

const app = express();
app.use(express.json());

app.use("/users", usersRoutes);
app.use("/videos", videosRoutes);
app.use("/comments", commentsRoutes);
app.use("/likes", likesRoutes);
app.use("/subscriptions", subscriptionsRoutes);
app.use("/views", viewsRoutes);

await connectDB();
app.listen(process.env.PORT ?? 3000, () =>
	console.log(`Server running on http://localhost:${process.env.PORT ?? 3000}`),
);
