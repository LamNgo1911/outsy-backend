import { Request, Response } from "express";
import matchService from "../services/matchService";
import { MatchInput } from "../types/types";
import { MatchStatus } from "@prisma/client";

export const getMatches = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const matches = await matchService.getMatches();
    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getMatchById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { matchId } = req.params;
  try {
    const match = await matchService.getMatchById(matchId);
    if (match) {
      res.status(200).json(match);
    } else {
      res.status(404).json({ message: "Match not found! " });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const createMatch = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newMatchRequestBody: MatchInput = req.body;

    const newMatch = await matchService.createMatch({
      ...newMatchRequestBody,
      status: MatchStatus.CONFIRMED,
    });
    res.status(201).json(newMatch);
  } catch (error) {
    res.status(500).json({ error: error });
    console.log(error);
  }
};

export const updateMatch = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { matchId } = req.params;
    const requestedData: MatchInput = req.body;

    const updatedMatch = await matchService.updateMatch(matchId, requestedData);
    res.status(204).json(updatedMatch);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const deleteMatch = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { matchId } = req.params;

    await matchService.deleteMatch(matchId);
    res.status(200).json({ message: `Delete match ${matchId} successfully.` });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
