import { LikeStatus } from "@prisma/client";
import prisma from "../config/prisma";
import { EventLike, EventLikeInput } from "../types/types";

const getAllLikedEvent = async (userId: string): Promise<EventLike[]> => {
  const allLikedEvents = await prisma.eventLike.findMany({ where: { userId } });

  if (!allLikedEvents) {
    throw new Error(`No event has been liked by user ${userId}.`);
  }

  return allLikedEvents;
};

const getSpecificLikedEvent = async (id: string): Promise<EventLike> => {
  const likedEvent = await prisma.eventLike.findUnique({ where: { id } });

  if (!likedEvent) {
    throw new Error(`No event has been liked by user with id ${id}.`);
  }

  return likedEvent;
};

const createLikeEvent = async (
  requestedEventLike: EventLikeInput
): Promise<EventLike> => {
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
  const newUpdatedEventLike = await prisma.eventLike.update({
    where: { id },
    data: { status, updatedAt: new Date() },
  });
  return newUpdatedEventLike;
};

const deleteLikedEvent = async (id: string): Promise<void> => {
  await prisma.eventLike.delete({ where: { id } });
};

export default {
  getSpecificLikedEvent,
  getAllLikedEvent,
  createLikeEvent,
  updateLikedEventStatus,
  deleteLikedEvent,
};
