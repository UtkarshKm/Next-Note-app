import mongoose from "mongoose";

const mongodbURL = process.env.MONGODB_URL || "";
let isConnected = false;
async function dbConnect() {
	if (isConnected) {
		console.log("mongoDb is already connected");
		return;
	}
	try {
		const db = await mongoose.connect(mongodbURL);
		isConnected = db.connection.readyState === 1;
		console.log("connected to mongoDB", db);
	} catch (error) {
		console.error("failed to connect", error);
		throw error;
	}
}

export default dbConnect;
