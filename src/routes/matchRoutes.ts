import express from "express";
import matchController from "../controllers/matchController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Create a new match
router.post("/", matchController.createMatch);

// Get match by ID
router.get("/:id", matchController.getMatchById);

// Get matches by event ID
router.get("/event/:eventId", matchController.getMatchesByEventId);

// Get matches by user ID
router.get("/user/:userId", matchController.getMatchesByUserId);

// Update match status
router.patch("/:id", matchController.updateMatch);

// Delete match
router.delete("/:id", matchController.deleteMatch);

export default router;
