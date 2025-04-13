import express from "express";
import * as matchController from "../controllers/matchController"; // Use named import
import authMiddleware from "../middlewares/authMiddleware"; // Corrected middleware path
import { getMatchByEventSchema, getMatchByIdSchema, getMatchByUserSchema, matchCreateSchema } from "../utils/validation/matchSchema";
import { validateRequest } from "../middlewares/validateRequest";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Create a new match
router.post("/", validateRequest(matchCreateSchema), matchController.createMatch);

// Get match by ID
router.get("/:matchId", validateRequest(getMatchByIdSchema), matchController.getMatchById);

// Get matches by event ID
router.get("/event/:eventId", validateRequest(getMatchByEventSchema), matchController.getMatchesByEventId);

// Get matches by user ID
router.get("/user/:userId", validateRequest(getMatchByUserSchema), matchController.getMatchesByUserId);

// Update match status
router.put("/:matchId", validateRequest(matchCreateSchema), matchController.updateMatch);

// Delete match
router.delete("/:matchId", validateRequest(getMatchByIdSchema), matchController.deleteMatch);

export default router;
