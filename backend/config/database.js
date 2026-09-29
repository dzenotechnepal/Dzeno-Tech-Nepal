import "dotenv/config";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}

const client = new MongoClient(uri);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    throw err;
  }
}

export async function disconnectFromMongoDB() {
  await client.close();
}

export function getDatabaseStatus() {
  if (client.isConnected()) {
    return "connected";
  } else {
    return "disconnected";
  }
}