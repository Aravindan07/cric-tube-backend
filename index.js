const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./db/db.connection");
const userRoutes = require("./routes/user.routes");

app.use(cors());
app.use(express.json());

connectDB();

app.use("/users", userRoutes);

const PORT = process.env.PORT || 7000;

app.listen(PORT, () =>
	console.log(`Server started on ${process.env.NODE_ENV} mode on port ${process.env.PORT}`)
);
