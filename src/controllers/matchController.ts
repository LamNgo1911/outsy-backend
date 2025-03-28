import { Request, Response } from "express";
import matchService from "../services/matchService";
import { MatchInput, MatchUpdateInput } from "../types/types";
import { NotFoundError, BadRequestError } from "../error/apiError";

// Create a new match
const createMatch = async (req: Request, res: Response) => {
  const matchInput: MatchInput = req.body;
  const match = await matchService.createMatch(matchInput);
  res.status(201).json(match);
};

// Get match by ID
const getMatchById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const match = await matchService.getMatchById(id);
  res.json(match);
};

// Get matches by event ID
const getMatchesByEventId = async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const matches = await matchService.getMatchesByEventId(eventId);
  res.json(matches);
};

// Get matches by user ID
const getMatchesByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const matches = await matchService.getMatchesByUserId(userId);
  res.json(matches);
};

// Update match status
const updateMatch = async (req: Request, res: Response) => {
  const { id } = req.params;
  const matchUpdateInput: MatchUpdateInput = req.body;
  const match = await matchService.updateMatch(id, matchUpdateInput);
  res.json(match);
};

// Delete match
const deleteMatch = async (req: Request, res: Response) => {
  const { id } = req.params;
  await matchService.deleteMatch(id);
  res.status(204).send();
};

export default {
  createMatch,
  getMatchById,
  getMatchesByEventId,
  getMatchesByUserId,
  updateMatch,
  deleteMatch,
};
