import prisma from "../config/prisma";
import { Match, MatchFilters, MatchInput } from "../types/types";
import { NotFoundError, BadRequestError } from "../error/apiError";
import { MatchStatus, Prisma } from "@prisma/client";

const stripUserPassword = (user: any) => {
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
};

const sanitizeMatch = (match: any) => ({
  ...match,
  host: stripUserPassword(match.host),
  guest: stripUserPassword(match.guest),
});

// Create a new match
const createMatch = async (input: MatchInput): Promise<Match> => {
  const { eventId, guestId } = input;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new NotFoundError("Event not found");
  }

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
      createdAt: new Date(),
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

  return sanitizeMatch(match);
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

  return sanitizeMatch(match);
};

// Get matches by event ID
const getMatchesByEventId = async (
  eventId: string,
  filters: MatchFilters = {},
  pagination: { page?: number; limit?: number }
): Promise<{ allMatches: Match[]; total: number }> => {
  const {
    status,
    eventType,
    eventStatus = "OPEN",
  } = filters;
  const { page = 1, limit = 10 } = pagination;
  const skip = (page - 1) * limit;

  const where: Prisma.MatchWhereInput = {
    ...(status && { status }),
    event: {
      ...(eventType && { type: eventType }),
      ...(eventStatus && { status: eventStatus }),
    },
  };

  const [matches, total] = await Promise.all([
    prisma.match.findMany({
      where: { eventId },
      skip,
      take: limit,
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
    }),
    prisma.match.count({ where }),
  ]);

  return {
    allMatches: matches.map(sanitizeMatch),
    total,
  };
};

// Get matches by user ID
const getMatchesByUserId = async (
  userId: string,
  filters: MatchFilters = {},
  pagination: { page?: number; limit?: number }
): Promise<{ allMatches: Match[]; total: number }> => {
  const {
    status,
    eventType,
    eventStatus = "OPEN",
  } = filters;
  const { page = 1, limit = 10 } = pagination;
  const skip = (page - 1) * limit;

  const where: Prisma.MatchWhereInput = {
    ...(status && { status }),
    event: {
      ...(eventType && { type: eventType }),
      ...(eventStatus && { status: eventStatus }),
    },
  };

  const [matches, total] = await Promise.all([
    prisma.match.findMany({
      where: {
        OR: [{ hostId: userId }, { guestId: userId }],
      },
      skip,
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
    }),
    prisma.match.count({ where }),
  ]);

  return {
    allMatches: matches.map(sanitizeMatch),
    total,
  };
};

// Update match status
const updateMatch = async (id: string, status: MatchStatus): Promise<Match> => {
  const match = await prisma.match.findUnique({
    where: { id },
  });

  if (!match) {
    throw new NotFoundError("Match not found");
  }

  const updatedMatch = await prisma.match.update({
    where: { id },
    data: {
      status,
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

  return sanitizeMatch(updatedMatch);
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
