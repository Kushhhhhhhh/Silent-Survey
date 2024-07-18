import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import mongoose from "mongoose";

export async function GET(request: Request) {
    // Connect to the MongoDB database
    await dbConnect();

    // Retrieve the current user's session
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    // Check if the user is authenticated
    if (!session || !session?.user) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Not authenticated",
            }),
            { status: 401 }
        );
    }

    // Extract user ID
    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const user = await UserModel.aggregate([
            {
                $match: {
                    _id: userId
                }
            },
            {
                $unwind: "$messages"
            },
            {
                $sort: {
                    "messages.createdAt": -1
                }
            },
            {
                $group: {
                    _id: "$_id",
                    messages: {
                        $push: "$messages"
                    }
                }
            }
        ]);

        console.log("Aggregated user data: ", user);

        if (!user || user.length === 0) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User not found",
                }),
                { status: 404 }
            );
        }

        console.log("User ID:", userId);
       const  checkingUser = await UserModel.findOne({_id: userId});
       console.log("Checking user: ", checkingUser);
       

        return new Response(
            JSON.stringify({
                success: true,
                messages: user[0].messages
            }),
            { status: 200 }
        );

    } catch (error) {
        console.log("Failed to get messages", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to get messages",
            }),
            { status: 500 }
        );
    }
}