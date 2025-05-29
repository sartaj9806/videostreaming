import mongoose from "mongoose";

// This is database connection 
const connectDB = async () => {
    try {

        // Connecting database
        await mongoose.connect(`${process.env.MONGO_URI}/BoomAssignment`)
        console.log("MongoDB connected successfully");

    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1); // Exit the process with failure
    }
}

export default connectDB;