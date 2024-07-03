import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
} from '@react-email/components';

interface VerificationEmailProps {
    username: string;
    otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
    return (
        <Html lang='en' dir='ltr'>
            <Head>
                <title>Verification Code</title>
                <Font
                    fontFamily="Inter"
                    fallbackFontFamily="sans-serif"
                    webFont={{
                        url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap",
                        format: "woff2"
                    }}
                    fontWeight={400}
                    fontStyle='normal'
                />
            </Head>
            <Preview>Here &apos;s your verification code: {otp}</Preview>

            <Section>
                <Row>
                    <Heading as='h2'>
                        Hello {username},
                    </Heading>
                </Row>
                <Row>
                    <Text>
                        Thankyou for registering with us. Please use the code below to verify your account.
                    </Text>
                </Row>
                <Row>
                    <Text>
                        Your verification code is {otp}.
                    </Text>
                </Row>
                <Row>
                    <Text>
                        If you did not register with us, please ignore this email.
                    </Text>
                </Row>
            </Section>

        </Html>
    );
}