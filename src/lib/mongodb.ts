import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
	throw new Error("Please define MONGODB_URL");
}

async function dbConnect(): Promise<void> {
	if (mongoose.connection.readyState === 1) {
		console.log("MongoDB is already connected");
		return;
	}

	if (mongoose.connection.readyState === 2) {
		console.log("MongoDB is connecting...");
		return;
	}

	try {
		
		await mongoose.connect(MONGODB_URL);
		console.log("Connected to MongoDB successfully");
	} catch (error) {
		console.error("Failed to connect to MongoDB:", error);
		throw error;
	}
}



// Optional: Add event listeners for better debugging
mongoose.connection.on("connected", () => {
	console.log("Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
	console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
	console.log("Mongoose disconnected from MongoDB");
});

export default dbConnect;
