import { UserModel } from "@/model/User";
import { dbConnect } from "@/lib/dbConnect";
import { Message } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();

    const { username, content } = await request.json();

    try {

        const user = await UserModel.findOneAndUpdate({ username })

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }

        // Is User accepting messages
        if (!user.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: "User is not accepting messages"
            }, { status: 403 })
        }

        const newMessage = { content, createdAt : new Date() };
        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json({ 
            success: true, 
            message: "Message sent successfully" 
        }, { status: 200 })

    } catch (error) {
        console.log("Error in sending message", error);
        
        return Response.json({
            success: false,
            message: "Error in sending message"
        }, { status: 500 })
    }
}