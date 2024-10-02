import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    // Connect to the database
    await dbConnect();

    try {
        const { username, email, password } = await request.json();

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        });

        if (existingUserVerifiedByUsername) {
            return NextResponse.json({
                success: false,
                message: "User already exists",
            }, { status: 400 });
        }

        // Check if a user with the same email already exists
        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate OTP

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return NextResponse.json({
                    success: false,
                    message: "User already exists with this email",
                }, { status: 400 });
            } else {
                // Update password and OTP for unverified user
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour expiry
                await existingUserByEmail.save();
            }
        } else {
            // Create a new user if not found
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
                messages: [],
            });
            await newUser.save();
        }

        return NextResponse.json({
            success: true,
            message: "User Registered Successfully",
            verifyCode: verifyCode
        }, { status: 200 });

    } catch (error) {
        console.log("Error while signing up", error);
        return NextResponse.json({
            success: false,
            message: "Error registering User",
        }, { status: 500 });
    }
}