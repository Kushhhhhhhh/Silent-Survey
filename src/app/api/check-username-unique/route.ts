import { z } from "zod";
import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import { usernameValidation } from "@/schema/signup-schema";

const usernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get("username")
        }
        const result = usernameQuerySchema.safeParse(queryParam);
        console.log("Username validation result:", JSON.stringify(result, null, 2));

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            console.log("Username validation failed:", usernameErrors);

            return Response.json({
                success: false,
                message: "Invalid username",
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
            console.log(`Username "${username}" already exists`);
            return Response.json({
                success: false,
                message: "Username already exists"
            },
            { status: 400 });
        }

        console.log(`Username "${username}" is unique`);
        return Response.json({ 
            success: true, 
            message: "Username is unique" 
        });

    } catch (error) {
        console.error("Error checking username:", error);
        return Response.json({
            success: false,
            message: "Error checking username"
        },
        { status: 500 });
    }
}