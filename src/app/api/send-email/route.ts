import { NextRequest, NextResponse } from "next/server";
import emailjs from '@emailjs/nodejs';

// Define a type for the expected request body
interface EmailRequestBody {
  username: string;
  email: string;
  otp: string;
}

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { username, email, otp }: EmailRequestBody = await req.json();

    // Validate request body
    if (!username || !email || !otp) {
      return NextResponse.json(
        { error: "Missing username, email, or OTP in request body" },
        { status: 400 }
      );
    }

    // Initialize EmailJS with private key
    emailjs.init({
      publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      privateKey: process.env.NEXT_PUBLIC_EMAILJS_PRIVATE_KEY,
    });

    // Prepare email data with dynamic parameters
    const emailData = {
      service_id: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      template_id: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
      template_params: {
        to_name: username,
        to_email: email,
        otp: otp,
      },
      user_id: process.env.NEXT_PUBLIC_EMAILJS_USER_ID,
    };

    // Send email using EmailJS
    const response = await emailjs.send(
      emailData.service_id!,
      emailData.template_id!,
      emailData.template_params,
      {
        publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
        privateKey: process.env.NEXT_PUBLIC_EMAILJS_PRIVATE_KEY!,
      }
    );

    // Handle response
    if (response.status !== 200) {
      console.error("Error sending email:", response.text);
      return NextResponse.json(
        { error: "Failed to send email: " + response.text },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Verification email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error sending verification email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}