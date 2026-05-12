import express from "express";
import {
  getProperties,
  getRecentProperties,
  getPropertyLocations,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertyLeases,
  getPropertyPayments,
  getAvailability,
  setAvailability,
  agentSubmitProperty,
  getPendingProperties,
  approveProperty,
  rejectProperty,
} from "../controllers/propertyControllers";
import multer from "multer";
import { authMiddleware } from "../middleware/authMiddleware";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

// Public routes
router.get("/", getProperties);
router.get("/recent", getRecentProperties);
router.get("/locations", getPropertyLocations);

// Agent submission - public, no auth required
router.post(
  "/agent-submit",
  upload.array("photos"),
  agentSubmitProperty
);

// Manager review routes
router.get(
  "/pending",
  authMiddleware(["manager"]),
  getPendingProperties
);
router.put(
  "/:id/approve",
  authMiddleware(["manager"]),
  approveProperty
);
router.put(
  "/:id/reject",
  authMiddleware(["manager"]),
  rejectProperty
);

// Existing routes
router.get("/:id", getProperty);
router.get("/:id/availability", getAvailability);
router.post(
  "/:id/availability",
  authMiddleware(["manager"]),
  setAvailability
);
router.get("/:id/leases", getPropertyLeases);
router.get("/:id/payments", getPropertyPayments);
router.post(
  "/",
  authMiddleware(["manager"]),
  upload.array("photos"),
  createProperty
);
router.put(
  "/:id",
  authMiddleware(["manager"]),
  upload.array("photos"),
  updateProperty
);
router.delete("/:id", authMiddleware(["manager"]), deleteProperty);

export default router;
