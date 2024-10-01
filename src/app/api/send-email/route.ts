import VerificationEmail from "../../../../email/verification-email"
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const { username, email } = await req.json();

    const { data, error } = await resend.emails.send({
      from: 'Silent Survey <noreply@silentsurvey.com>',
      to: [email],
      subject: 'Verify Your Account',
      react: VerificationEmail({ username, otp }),
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ message: 'Verification email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return Response.json({ error: 'Failed to send verification email' }, { status: 500 });
  }
}