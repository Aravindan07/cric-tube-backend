const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./db/db.connection");
const userRoutes = require("./routes/user.router");
const videoRoutes = require("./routes/videos.router");
const likedVideoRoutes = require("./routes/likedVideos.router");
const disLikedVideoRoutes = require("./routes/dislikedVideos.router");
const watchLaterVideoRoutes = require("./routes/watchLater.router");
const savedVideoRoutes = require("./routes/savedVideos.router");
const videoNoteRoutes = require("./routes/notes.router");
const categoryRoutes = require("./routes/categories.router");
const playlistRoutes = require("./routes/playlists.router");

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/videos", likedVideoRoutes);
app.use("/api/v1/videos", disLikedVideoRoutes);
app.use("/api/v1/users", watchLaterVideoRoutes);
app.use("/api/v1/users", savedVideoRoutes);
app.use("/api/v1/users", videoNoteRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/users", playlistRoutes);

const PORT = process.env.PORT || 7000;

app.listen(PORT, () =>
	console.log(`Server started on ${process.env.NODE_ENV} mode on port ${process.env.PORT}`)
);
