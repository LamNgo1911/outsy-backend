import { Router } from "express";
import {
  getAllVenues,
  getVenueById,
  createVenue,
  updateVenue,
  deleteVenue,
} from "../controllers/venueController";
import { adminCheck } from "../middleware/adminCheck";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  createVenueSchema,
  updateVenueSchema,
  venueIdSchema,
} from "../zod-schema/venueSchema";
import { validateRequest } from "../middleware/validateRequest";

const router = Router();

router.use(authMiddleware);

router.get("/", getAllVenues);

router.get("/:id", validateRequest(venueIdSchema), getVenueById);

router.post("/", validateRequest(createVenueSchema), createVenue);

router.use(adminCheck);

router.delete("/:id", validateRequest(updateVenueSchema), updateVenue);

router.put("/:id", validateRequest(venueIdSchema), deleteVenue);

export default router;
