import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {};

export async function dbConnect(): Promise<void> {

    if (connection.isConnected) {
        console.log("Already connected");
        return;
    }

    try {

        const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
        connection.isConnected = db.connections[0].readyState;
        console.log("Database connected successfully");

    } catch (error) {
        console.log("Database connection failed", error);
        process.exit(1);

    }
}