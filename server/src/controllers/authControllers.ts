import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateVerificationCode, sendVerificationEmail } from "../lib/email";

const prisma = new PrismaClient();

export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "Name, email, and password are required" });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ message: "An account with this email already exists" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const verificationCodeExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "tenant",
        verificationCode,
        verificationCodeExpiresAt,
      },
    });

    // Send verification email
    await sendVerificationEmail(email, verificationCode, name);

    res.status(201).json({
      message: "Registration successful. Please check your email for the verification code.",
      userId: user.authId,
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({ message: `Error during registration: ${error.message}` });
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      res.status(400).json({ message: "Email and verification code are required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ message: "Email is already verified" });
      return;
    }

    if (user.verificationCode !== code) {
      res.status(400).json({ message: "Invalid verification code" });
      return;
    }

    if (user.verificationCodeExpiresAt && user.verificationCodeExpiresAt < new Date()) {
      res.status(400).json({ message: "Verification code has expired. Please request a new one." });
      return;
    }

    // Mark user as verified
    await prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        verificationCode: null,
        verificationCodeExpiresAt: null,
      },
    });

    res.json({ message: "Email verified successfully. You can now sign in." });
  } catch (error: any) {
    console.error("Verification error:", error);
    res.status(500).json({ message: `Error during verification: ${error.message}` });
  }
};

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    if (!user.isVerified) {
      res.status(403).json({ message: "Please verify your email before signing in." });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET || "your-super-secret-jwt-key";
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "7d";
    const token = jwt.sign(
      {
        sub: user.authId,
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: jwtExpiresIn } as jwt.SignOptions
    );

    res.json({
      token,
      user: {
        authId: user.authId,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ message: `Error during login: ${error.message}` });
  }
};

export const resendVerificationCode = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ message: "Email is already verified" });
      return;
    }

    const verificationCode = generateVerificationCode();
    const verificationCodeExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: { verificationCode, verificationCodeExpiresAt },
    });

    await sendVerificationEmail(email, verificationCode, user.name);

    res.json({ message: "A new verification code has been sent to your email." });
  } catch (error: any) {
    console.error("Resend code error:", error);
    res.status(500).json({ message: `Error resending code: ${error.message}` });
  }
};
