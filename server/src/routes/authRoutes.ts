import express from "express";
import {
  register,
  login,
  verifyEmail,
  resendVerificationCode,
} from "../controllers/authControllers";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify", verifyEmail);
router.post("/resend-code", resendVerificationCode);

export default router;
