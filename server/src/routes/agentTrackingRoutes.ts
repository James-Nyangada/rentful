import express from "express";
import { getAgentTrackingData } from "../controllers/agentTrackingControllers";

const router = express.Router();

router.get("/tracking", getAgentTrackingData);

export default router;
