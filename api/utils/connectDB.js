import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) throw new Error("MONGODB_URI not defined");

  try {
    // console.log("Connecting to MongoDB with URI:", mongoURI);
    await mongoose.connect(mongoURI);
    isConnected = true;
    console.log("MongoDB connected successfully ✅");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
};

export default connectDB;
