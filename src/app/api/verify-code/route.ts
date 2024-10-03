import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, code } = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedUsername });
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        console.log("User's verifyCode:", user.verifyCode);
        console.log("Provided code:", code);
        console.log("User's isVerified status:", user.isVerified);

        if (user.isVerified) {
            return Response.json(
                {
                    success: true,
                    message: "User is already verified",
                },
                { status: 200 }
            );
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        console.log("Is code valid?", isCodeValid);
        console.log("Is code not expired?", isCodeNotExpired);

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();

            return Response.json(
                {
                    success: true,
                    message: "User verified successfully",
                },
                { status: 200 }
            )
        } else if (!isCodeNotExpired) {
            return Response.json(
                {
                    success: false,
                    message: "Verification Code has expired. Please request a new code by signing up again",
                },
                { status: 400 }
            );
        } else {
            return Response.json(
                {
                    success: false,
                    message: "Invalid verification code",
                },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error("Error verifying user", error);
        return Response.json(
            {
                success: false,
                message: "Failed to verify user",
            },
            { status: 500 }
        );
    }
}