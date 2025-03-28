import prisma from "../config/prisma";
import { Match, MatchInput, MatchUpdateInput } from "../types/types";
import { NotFoundError, BadRequestError } from "../error/apiError";
import { MatchStatus } from "@prisma/client";

// Create a new match
const createMatch = async (input: MatchInput): Promise<Match> => {
  const { eventId, guestId } = input;

  // Check if event exists
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  // Check if guest exists
  const guest = await prisma.user.findUnique({
    where: { id: guestId },
  });

  if (!guest) {
    throw new NotFoundError("Guest not found");
  }

  // Check if match already exists
  const existingMatch = await prisma.match.findFirst({
    where: {
      eventId,
      guestId,
    },
  });

  if (existingMatch) {
    throw new BadRequestError("Match already exists");
  }

  const match = await prisma.match.create({
    data: {
      eventId,
      hostId: event.hostId,
      guestId,
      status: MatchStatus.CONFIRMED,
    },
    include: {
      event: true,
      host: {
        include: {
          preferences: true,
        },
      },
      guest: {
        include: {
          preferences: true,
        },
      },
    },
  });

  return match;
};

// Get match by ID
const getMatchById = async (id: string): Promise<Match> => {
  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      event: true,
      host: {
        include: {
          preferences: true,
        },
      },
      guest: {
        include: {
          preferences: true,
        },
      },
    },
  });

  if (!match) {
    throw new NotFoundError("Match not found");
  }

  return match;
};

// Get matches by event ID
const getMatchesByEventId = async (eventId: string): Promise<Match[]> => {
  const matches = await prisma.match.findMany({
    where: { eventId },
    include: {
      event: true,
      host: {
        include: {
          preferences: true,
        },
      },
      guest: {
        include: {
          preferences: true,
        },
      },
    },
  });

  return matches;
};

// Get matches by user ID
const getMatchesByUserId = async (userId: string): Promise<Match[]> => {
  const matches = await prisma.match.findMany({
    where: {
      OR: [{ hostId: userId }, { guestId: userId }],
    },
    include: {
      event: true,
      host: {
        include: {
          preferences: true,
        },
      },
      guest: {
        include: {
          preferences: true,
        },
      },
    },
  });

  return matches;
};

// Update match status
const updateMatch = async (
  id: string,
  input: MatchUpdateInput
): Promise<Match> => {
  const match = await prisma.match.findUnique({
    where: { id },
  });

  if (!match) {
    throw new NotFoundError("Match not found");
  }

  const updatedMatch = await prisma.match.update({
    where: { id },
    data: {
      ...input,
      updatedAt: new Date(),
    },
    include: {
      event: true,
      host: {
        include: {
          preferences: true,
        },
      },
      guest: {
        include: {
          preferences: true,
        },
      },
    },
  });

  return updatedMatch;
};

// Delete match
const deleteMatch = async (id: string): Promise<void> => {
  const match = await prisma.match.findUnique({
    where: { id },
  });

  if (!match) {
    throw new NotFoundError("Match not found");
  }

  await prisma.match.delete({
    where: { id },
  });
};

export default {
  createMatch,
  getMatchById,
  getMatchesByEventId,
  getMatchesByUserId,
  updateMatch,
  deleteMatch,
};
