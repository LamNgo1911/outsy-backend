import { Router } from "express";
import {
  changeEventStatus,
  createEvent,
  getEventById,
  getEvents,
  updateEvent,
} from "../controllers/eventController";

const router = Router();

router.get("/all", getEvents);
router.get("/:id", getEventById);
router.post("/", createEvent);
router.put("/:id", updateEvent);
router.put("/change-status", changeEventStatus);

export default router;
