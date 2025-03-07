import { Router } from "express";
import {
  getAllVenues,
  getVenueById,
  createVenue,
  updateVenue,
  deleteVenue,
} from "../controllers/venueController";

const router = Router();

router.get("/", getAllVenues);

router.get("/:id", getVenueById);

router.post("/", createVenue);

router.delete("/:id", updateVenue);

router.put("/:id", deleteVenue);

export default router;
