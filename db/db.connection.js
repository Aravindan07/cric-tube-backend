const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		const connection = await mongoose.connect(process.env.URI, {
			useCreateIndex: true,
			useFindAndModify: false,
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log(`MongoDB connected on ${connection.connection.host}`);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

module.exports = connectDB;
