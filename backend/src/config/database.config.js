import mongoose from "mongoose";
import { config } from "./app.config.js";

export const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log("connected to MongoDB successfully");
    } catch (error) {
        console.log("MongoDB connection error", error);
        process.exit(1);
    }
};