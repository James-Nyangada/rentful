import express from "express";
import {
  createBooking,
  getManagerViewings,
} from "../controllers/viewingControllers";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/book", createBooking);
router.get("/", authMiddleware(["manager"]), getManagerViewings);

export default router;
