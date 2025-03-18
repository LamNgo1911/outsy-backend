import { Router } from "express";
import {
  createLikedEvent,
  deleteLikedEvent,
  getAllLikedEvent,
  getLikedEventById,
  updateLikedEventStatus,
} from "../controllers/eventLikeController";

const router = Router();

router.get("/", getAllLikedEvent);

router.get("/:eventLikeId", getLikedEventById);

router.post("/", createLikedEvent);

router.put("/:eventLikeId", updateLikedEventStatus);

router.delete("/:eventLikeId", deleteLikedEvent);

export default router;
