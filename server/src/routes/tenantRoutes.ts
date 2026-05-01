import express from "express";
import {
  getTenant,
  createTenant,
  updateTenant,
  getCurrentResidences,
  addFavoriteProperty,
  removeFavoriteProperty,
} from "../controllers/tenantControllers";

const router = express.Router();

router.get("/:authId", getTenant);
router.put("/:authId", updateTenant);
router.post("/", createTenant);
router.get("/:authId/current-residences", getCurrentResidences);
router.post("/:authId/favorites/:propertyId", addFavoriteProperty);
router.delete("/:authId/favorites/:propertyId", removeFavoriteProperty);

export default router;
