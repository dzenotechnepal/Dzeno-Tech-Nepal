import "dotenv/config";
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}

export async function connectToMongoDB() {
  try {
    await mongoose.connect(uri);
    console.log("You successfully connected to MongoDB!");
    return mongoose.connection;
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    throw err;
  }
}

export async function disconnectFromMongoDB() {
  await mongoose.disconnect();
}

export function getDatabaseStatus() {
  if (mongoose.connection.readyState === 1) {
    return "connected";
  } else {
    return "disconnected";
  }
}