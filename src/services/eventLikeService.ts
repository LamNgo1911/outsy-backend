import { LikeStatus, Prisma } from "@prisma/client";
import prisma from "../config/prisma";
import {
  EventLike,
  EventLikeFilters,
  EventLikeInput,
} from "../types/eventTypes";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../error/apiError";

//NOTE - The user caching should be utilized in this case, instead of
//searching for new user everytime
const getAllLikedEvent = async (
  userId: string,
  filters: EventLikeFilters = {},
  pagination: { page?: number; limit?: number }
): Promise<{ allLikedEvents: EventLike[]; total: number }> => {
  const { type, status = "OPEN", venueId, dateRange, likeStatus } = filters;
  const { page = 1, limit = 10 } = pagination;
  const skip = (page - 1) * limit;

  const prismaUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!prismaUser) {
    throw new NotFoundError(`No user with id ${userId} found!`);
  }

  const where: Prisma.EventLikeWhereInput = {
    userId,
    ...(likeStatus && { status: likeStatus }),
    event: {
      status,
      type,
      ...(venueId && { venueId }),
      ...(dateRange && {
        date: {
          gte: new Date(dateRange.start),
          lte: new Date(dateRange.end),
        },
      }),
    },
  };

  const [allLikedEvents, total] = await Promise.all([
    prisma.eventLike.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        event: { date: "asc" },
      },
      include: {
        event: true,
      },
    }),
    prisma.eventLike.count({ where }),
  ]);

  return { allLikedEvents, total };
};

const getSpecificLikedEvent = async (id: string): Promise<EventLike> => {
  const likedEvent = await prisma.eventLike.findUnique({ where: { id } });

  if (!likedEvent) {
    throw new NotFoundError("Event like not found or has been deleted!");
  }

  return likedEvent;
};

const createLikeEvent = async (
  requestedEventLike: EventLikeInput
): Promise<EventLike> => {
  const findEvent = await prisma.event.findUnique({
    where: { id: requestedEventLike.eventId },
  });

  if (!findEvent) {
    throw new NotFoundError(
      "Event you are looking for is not found or has been deleted!"
    );
  }
  if (findEvent.hostId === requestedEventLike.userId) {
    throw new BadRequestError("An event host can't like themselves event!");
  }

  const newLikedEvent = await prisma.eventLike.create({
    data: {
      ...requestedEventLike,
      status: LikeStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return newLikedEvent;
};

const updateLikedEventStatus = async (
  id: string,
  status: LikeStatus
): Promise<EventLike> => {
  const eventLike = await prisma.eventLike.findUnique({ where: { id } });

  if (!eventLike) {
    throw new NotFoundError("Event like not found or has been deleted!");
  }
  if (eventLike.status === "ACCEPTED" && status === "ACCEPTED") {
    throw new ForbiddenError("Reject the current like status before changing!");
  }

  const newUpdatedEventLike = await prisma.eventLike.update({
    where: { id },
    data: { status, updatedAt: new Date() },
  });

  return newUpdatedEventLike;
};

const deleteLikedEvent = async (id: string): Promise<void> => {
  const eventLike = await prisma.eventLike.findUnique({ where: { id } });

  if (!eventLike) {
    throw new NotFoundError("Event like not found or has been deleted!");
  }

  await prisma.eventLike.delete({ where: { id } });
};

export default {
  getSpecificLikedEvent,
  getAllLikedEvent,
  createLikeEvent,
  updateLikedEventStatus,
  deleteLikedEvent,
};
