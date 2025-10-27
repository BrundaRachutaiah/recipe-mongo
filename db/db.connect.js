import mongoose from "mongoose";

let isConnected = false; // Track connection status

export async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) return;

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("✅ MongoDB connected:", conn.connection.host);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw new Error("Database connection failed");
  }
}
