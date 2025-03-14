import { Router } from "express";
import {
  createMatch,
  deleteMatch,
  getMatchById,
  getMatches,
  updateMatch,
} from "../controllers/matchController";

const router = Router();

router.post("/", createMatch);

router.delete("/:matchId", deleteMatch);

router.get("/", getMatches);

router.get("/:matchId", getMatchById);

router.put("/:matchId", updateMatch);

export default router;
