import { resend } from "@/lib/resend";
import VerificationEmail from "../../email/verification-email";
import { ApiResponse } from "@/types/api-response";

export async function sendVerificationEmail(
    email: string, 
    username: string,
    verifyCode: string): Promise<ApiResponse> {
        try {
            await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: email,
                subject: 'Incognito Chat | Verification Code',
                react: VerificationEmail({ username, otp: verifyCode }),
              });
            return {success: true, message: "Successfully sent verification email" }
        } catch (emailError) {
            console.log("Error sending verification Email", emailError);
            return { success: false, message: "Failed to send verification email" };
        }
}