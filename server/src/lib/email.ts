import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendVerificationEmail = async (
  to: string,
  code: string,
  name: string
): Promise<void> => {
  try {
    const data = await resend.emails.send({
      from: process.env.SMTP_FROM || "Rentiful <onboarding@resend.dev>",
      to: [to],
      subject: "Verify your Rentiful account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1e3a5f;">Welcome to Rentiful, ${name}!</h2>
          <p>Thank you for signing up. Please use the following verification code to activate your account:</p>
          <div style="background-color: #f0f4ff; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1e3a5f;">${code}</span>
          </div>
          <p style="color: #666;">This code will expire in 15 minutes.</p>
          <p style="color: #666;">If you didn't create an account, please ignore this email.</p>
        </div>
      `,
    });

    console.log("📧 Verification email sent:", data);
  } catch (error) {
    console.error("📧 Error sending verification email:", error);
  }
};
