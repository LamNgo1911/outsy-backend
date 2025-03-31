import { Router } from "express";
import {
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
  updateEvent,
} from "../controllers/eventController";
import { validateRequest } from "../middleware/validateRequest";
import {
  eventCreateSchema,
  eventIdSchema,
  eventUpdateSchema,
} from "../zod-schema/eventSchema";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getEvents);
router.get("/:eventId", validateRequest(eventIdSchema), getEventById);
router.post("/", validateRequest(eventCreateSchema), createEvent);
router.put("/:eventId", validateRequest(eventUpdateSchema), updateEvent);
router.delete("/:eventId", validateRequest(eventIdSchema), deleteEvent);

export default router;
