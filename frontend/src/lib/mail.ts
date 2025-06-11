import {Resend} from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {

    await resend.emails.send({
        from: "underworld-company@resend.dev",
        to: email,
        subject: "2FA code",
        html: `
            <p>Your 2FA code : ${token}</p>
        `
    });
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/new-password?token=${token}`;

    await resend.emails.send({
        from: "underworld-company@resend.dev",
        to: email,
        subject: "Reset your password",
        html: `
            <p>Thank you for signing up! Please reset your password by clicking the link below:</p>
            <a href="${resetLink}">Reset password</a>
        `
    });
}
export const sendVerificationEmail = async (email: string, token: string) => {
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/new-verification?token=${token}`;

    await resend.emails.send({
        from: "underworld-company@resend.dev",
        to: email,
        subject: "Verify your email",
        html: `
            <p>Thank you for signing up! Please verify your email address by clicking the link below:</p>
            <a href="${verificationUrl}">Verify Email</a>
        `
    });
}