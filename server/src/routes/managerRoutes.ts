import express from "express";
import {
  getManager,
  createManager,
  updateManager,
  getManagerProperties,
} from "../controllers/managerControllers";

const router = express.Router();

router.get("/:authId", getManager);
router.put("/:authId", updateManager);
router.get("/:authId/properties", getManagerProperties);
router.post("/", createManager);

export default router;
