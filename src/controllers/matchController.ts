import { Request, Response, NextFunction } from "express";
import matchService from "../services/matchService";
import { MatchFilters, MatchInput, PaginationParams } from "../types/types";
import { Result } from "../utils/Result";
import { EventStatus, EventType, MatchStatus } from "@prisma/client";

// Get match by ID
export const getMatchById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { matchId } = req.params;
    const match = await matchService.getMatchById(matchId);
    const serverResponse = Result.success(match);
    const { statusCode, body } = serverResponse.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error);
  }
};

// Get matches by event ID
export const getMatchesByEventId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { eventId } = req.params;
    const { eventType, status, eventStatus, page, limit } = req.query;

    const filters: MatchFilters = {
      ...(eventType && { eventType: eventType as EventType }),
      ...(status && { status: status as MatchStatus }),
      ...(eventStatus && { eventStatus: eventStatus as EventStatus }),
    };

    const pagination: PaginationParams = {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    };

    const matches = await matchService.getMatchesByEventId(
      eventId,
      filters,
      pagination
    );
    const serverResponse = Result.success(matches);
    const { statusCode, body } = serverResponse.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error);
  }
};

// Get matches by user ID
export const getMatchesByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { eventType, status, page, limit } = req.query;
    const { userId } = req.params;

    const filters: MatchFilters = {
      ...(eventType && { eventType: eventType as EventType }),
      ...(status && { status: status as MatchStatus }),
    };

    const pagination: PaginationParams = {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    };

    const matches = await matchService.getMatchesByUserId(
      userId,
      filters,
      pagination
    );
    const serverResponse = Result.success(matches);
    const { statusCode, body } = serverResponse.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error);
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
    const response = Result.success(newMatch, 201);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error);
  }
};

// Update match status
export const updateMatch = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { matchId } = req.params;
    const status = req.body;

    const updatedMatch = await matchService.updateMatch(matchId, status);
    const response = Result.success(updatedMatch);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error);
  }
};

// Delete match
export const deleteMatch = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { matchId } = req.params;

    await matchService.deleteMatch(matchId);
    const response = Result.success(null, 204);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error);
  }
};
