import { z } from "zod";
import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import { usernameValidation } from "@/schema/signup-schema";

const usernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {

    await dbConnect();

    try {

        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get("username")
        }
        const result = usernameQuerySchema.safeParse(queryParam);
        console.log(result);

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];

            return Response.json({
                success: false,
                message: "Username is not unique",
                errors: usernameErrors
            },
            { status: 400 });
        }

        const { username } = result.data;

        const existingVerifiedUser = await UserModel.findOne({
            username, 
            isVerified: true
        })

        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username already exists"
            },
            { status: 400 });
        }

        return Response.json({ 
            success: true, 
            message: "Username is unique" });

    } catch (error: any) {
        console.log("Error checking Username", error);
        return Response.json({
            success: false,
            message: "Error checking Username"
        },
            { status: 500 });
    }
}