const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./db/db.connection");
const userRoutes = require("./routes/user.router");
const videoRoutes = require("./routes/videos.router");
const likedVideoRoutes = require("./routes/likedVideos.router");

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/videos", likedVideoRoutes);

const PORT = process.env.PORT || 7000;

app.listen(PORT, () =>
	console.log(`Server started on ${process.env.NODE_ENV} mode on port ${process.env.PORT}`)
);
