import { UserModel } from "@/model/User";
import { dbConnect } from "@/lib/dbConnect";
import { Message } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();

    const { username, content } = await request.json();

    try {
        // Find the user by username
        const user = await UserModel.findOne({ username });

        // Check if the user exists
        if (!user) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User not found"
                }), 
                { status: 404 }
            );
        }

        // Check if the user is accepting messages
        if (!user.isAcceptingMessage) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User is not accepting messages"
                }), 
                { status: 403 }
            );
        }

        // Create a new message object
        const newMessage = { content, createdAt: new Date() };

        // Push the new message into the user's messages array
        user.messages.push(newMessage as Message);

        // Save the updated user document
        await user.save();

        // Return a success response
        return new Response(
            JSON.stringify({ 
                success: true, 
                message: "Message sent successfully" 
            }), 
            { status: 200 }
        );

    } catch (error) {
        console.log("Error in sending message", error);
        
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error in sending message"
            }), 
            { status: 500 }
        );
    }
}