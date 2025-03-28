import prisma from "../config/prisma";
import { Match, MatchInput } from "../types/types";

const getMatches = async (): Promise<Match[]> => {
  const matches = await prisma.match.findMany();
  return matches;
};

const getMatchById = async (matchId: string): Promise<Match> => {
  const match = await prisma.match.findUnique({ where: { id: matchId } });

  if (!match) {
    throw new Error(`User ID ${matchId} not found.`);
  }

  return match;
};

const createMatch = async ({
  hostId,
  guestId,
  chatId,
  status,
  eventId,
}: MatchInput): Promise<Match> => {
  const newMatch = await prisma.match.create({
    data: {
      hostId,
      guestId,
      chatId,
      status,
      eventId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return newMatch;
};

const updateMatch = async (
  id: string,
  matchUpdateInput: MatchInput
): Promise<Match> => {
  const newUpdatedMatch = await prisma.match.update({
    where: { id },
    data: { ...matchUpdateInput, updatedAt: new Date() },
  });
  return newUpdatedMatch;
};

const deleteMatch = async (id: string): Promise<void> => {
  await prisma.match.delete({ where: { id } });
};

export default {
  getMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
};
