import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/model/User";

export async function DELETE(request: Request, { params }: { params: { messageid: string }}) {
    const messageId = params.messageid
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

    try {

        const updatedResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } },
        )

        if(updatedResult.modifiedCount == 0){
            return Response.json({
                    success: false,
                    message: "Message already deleted or not found",
                }, { status: 404 })
        } 

        return Response.json({
            success: true,
            message: "Message deleted successfully",
        }, { status: 200 } )

    } catch (error) {
        console.log("Error deleting message", error)
        return Response.json({
                success: false,
                message: "Failed to delete message",
            }, { status: 500 })
    }

}