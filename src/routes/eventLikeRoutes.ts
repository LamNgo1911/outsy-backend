import { Router } from "express";
import {
  createLikedEvent,
  deleteLikedEvent,
  getAllLikedEvent,
  getLikedEventById,
  updateLikedEventStatus,
} from "../controllers/eventLikeController";
import authMiddleware from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
  allEventLikeSchema,
  eventLikeCreateSchema,
  eventLikeIdSchema,
  eventLikeUpdateSchema,
} from "../utils/zod-schema/eventLikeSchema";

const router = Router();

router.use(authMiddleware);

router.get("/", getAllLikedEvent);

router.get(
  "/all/:userId",
  validateRequest(allEventLikeSchema),
  getAllLikedEvent
);

router.get(
  "/:eventLikeId",
  validateRequest(eventLikeIdSchema),
  getLikedEventById
);

router.post("/", validateRequest(eventLikeCreateSchema), createLikedEvent);

router.put(
  "/:eventLikeId",
  validateRequest(eventLikeUpdateSchema),
  updateLikedEventStatus
);

router.delete(
  "/:eventLikeId",
  validateRequest(eventLikeIdSchema),
  deleteLikedEvent
);

export default router;
