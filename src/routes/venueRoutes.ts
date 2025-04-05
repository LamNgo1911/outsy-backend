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

const router = Router();

router.use(authMiddleware);

router.get("/", getAllVenues);

router.get("/:id", getVenueById);

router.use(adminCheck);

router.post("/", createVenue);

router.delete("/:id", updateVenue);

router.put("/:id", deleteVenue);

export default router;
