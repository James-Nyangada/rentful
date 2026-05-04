import express from "express";
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  getPropertyLeases,
  getPropertyPayments,
  getAvailability,
  setAvailability,
} from "../controllers/propertyControllers";
import multer from "multer";
import { authMiddleware } from "../middleware/authMiddleware";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.get("/", getProperties);
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

export default router;
