import { Request, Response, NextFunction } from "express";
import matchService from "../services/matchService";
import { MatchInput, MatchUpdateInput } from "../types/types";

// Get match by ID
export const getMatchById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params; // Corrected parameter name
  try {
    const match = await matchService.getMatchById(id); // Use id
    res.status(200).json(match);
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
};

// Get matches by event ID
export const getMatchesByEventId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { eventId } = req.params;
  try {
    const matches = await matchService.getMatchesByEventId(eventId);
    res.status(200).json(matches);
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
};

// Get matches by user ID
export const getMatchesByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userId } = req.params; // Assuming userId is passed as a param
  try {
    const matches = await matchService.getMatchesByUserId(userId);
    res.status(200).json(matches);
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
};

// Create a new match
export const createMatch = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newMatchRequestBody: MatchInput = req.body;
    const newMatch = await matchService.createMatch(newMatchRequestBody);
    res.status(201).json(newMatch);
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
};

// Update match status
export const updateMatch = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params; // Corrected parameter name
    const requestedData: MatchUpdateInput = req.body; // Use MatchUpdateInput type

    const updatedMatch = await matchService.updateMatch(id, requestedData); // Use id
    res.status(200).json(updatedMatch); // Return 200 OK with updated match
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
};

// Delete match
export const deleteMatch = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params; // Corrected parameter name

    await matchService.deleteMatch(id); // Use id
    res.status(204).send(); // Return 204 No Content on successful deletion
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
};
