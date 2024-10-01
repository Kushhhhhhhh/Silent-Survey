import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import bcrypt from "bcryptjs";
import { SendVerificationEmail } from "@/helper/send-verification-email";

export async function POST(request: Request) {
    // Connect to the database
    await dbConnect();

    try {
        // Extract data from the request
        const { username, email, password } = await request.json();

        // Check if a verified user with the same username already exists
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        });

        if (existingUserVerifiedByUsername) {
            // Return an error if the user already exists
            return Response.json(
                {
                    success: false,
                    message: "User already exists",
                }, { status: 400 }
            );
        }

        // Check if a user with the same email already exists
        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail?.isVerified) {
                // Return an error if the user with the email is already verified
                return Response.json({
                    success: false,
                    message: "User already exists with this email",
                }, { status: 400 });
            } else {
                // Update the existing user's password and verification code if not verified
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000);
                await existingUserByEmail.save();
                SendVerificationEmail(existingUserByEmail.email, existingUserByEmail.username, existingUserByEmail.verifyCode);
            }
        } else {
            // Create a new user if no existing user is found with the email
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            });
            await newUser.save();
            SendVerificationEmail(newUser.email, newUser.username, newUser.verifyCode);
        }

        // Return a success response
        return Response.json(
            {
                success: true,
                message: "User Registered Successfully, Please Login"
            }, { status: 200 }
        );
    } catch (error) {
        // Handle any errors
        console.log("Error while signing up", error);
        return Response.json(
            {
                success: false,
                message: "Error registering User",
            }, { status: 500 }
        );
    }
}