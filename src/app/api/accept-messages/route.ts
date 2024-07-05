import { getServerSession, User } from "next-auth"; 
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/model/User";

export async function POST(request: Request) {
    try {
        // Connect to the MongoDB database
        await dbConnect();

        // Retrieve the current user's session
        const session = await getServerSession(authOptions);
        
        // Check if the user is authenticated
        if (!session ||!session?.user) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Not authenticated",
                }), 
                { status: 401 }
            );
        }

        // Cast session.user to the User type
        const user: User = session.user as User;

        // Extract user ID and request data
        const userId = user._id;
        const { acceptMessages } = await request.json();

        // Update the user's accepting messages status
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        );

        // If the user is not found, return an error response
        if (!updatedUser) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Updated User not found",
                }), 
                { status: 404 }
            );
        }

        // Return a success response
        return new Response(
            JSON.stringify({
                success: true,
                message: "User status updated successfully",
            }), 
            { status: 200 }
        );

    } catch (error) {
        console.error("Failed to update the user status to accept messages", error);
        
        // Return a server error response
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to update the user status to accept messages",
            }), 
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        // Connect to the MongoDB database
        await dbConnect();

        // Retrieve the current user's session
        const session = await getServerSession(authOptions);

        // Check if the user is authenticated
        if (!session?.user) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Not authenticated",
                }), 
                { status: 401 }
            );
        }

        // Cast session.user to the User type
        const user: User = session.user as User;

        // Extract user ID
        const userId = user._id;

        // Find the user by ID
        const userFound = await UserModel.findById(userId);

        // If the user is not found, return an error response
        if (!userFound) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User not found",
                }), 
                { status: 404 }
            );
        }

        // Return the user's accepting messages status
        return new Response(
            JSON.stringify({
                success: true,
                isAcceptingMessage: userFound.isAcceptingMessage,
            }), 
            { status: 200 }
        );

    } catch (error) {
        console.error("Failed to retrieve the user status for accepting messages", error);
        
        // Return a server error response
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed retrieving message acceptance status",
            }), 
            { status: 500 }
        );
    }
}