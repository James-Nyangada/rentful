import express from "express";
import {
  getFeatures,
  addAmenity,
  removeAmenity,
  addHighlight,
  removeHighlight,
} from "../controllers/featureControllers";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", getFeatures);
router.post("/amenity", authMiddleware(["manager"]), addAmenity);
router.delete("/amenity/:id", authMiddleware(["manager"]), removeAmenity);
router.post("/highlight", authMiddleware(["manager"]), addHighlight);
router.delete("/highlight/:id", authMiddleware(["manager"]), removeHighlight);

export default router;
