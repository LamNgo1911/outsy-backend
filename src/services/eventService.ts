import { Prisma } from "@prisma/client";
import prisma from "../config/prisma";
import { EventFilters, Event, EventInput } from "../types/eventTypes";
import { PaginationParams } from "../types/types";

const getEvents = async (
  filters: EventFilters = {},
  pagination: PaginationParams = {}
): Promise<{ events: Event[]; total: number }> => {
  const {
    type = "FOOD",
    status = "OPEN",
    venueId,
    hostId,
    dateRange,
  } = filters;
  const { page = 1, limit = 10 } = pagination;
  const skip = (page - 1) * limit;

  const where: Prisma.EventWhereInput = {
    ...(type && { type }),
    ...(status && { status }),
    ...(dateRange && {
      date: {
        lte: new Date(dateRange.start),
        gte: new Date(dateRange.end),
      },
    }),
    ...(venueId && { venueId }),
    ...(hostId && { hostId }),
  };

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      skip,
      take: limit,
      orderBy: { date: "asc" },
      include: {
        venue: true,
        host: true,
      },
    }),
    prisma.event.count({ where }),
  ]);

  return { events, total };
};

const getEventById = async (eventId: string): Promise<Event> => {
  const event = await prisma.event.findUnique({ where: { id: eventId } });

  if (!event) {
    throw new Error(`User ID ${eventId} not found.`);
  }

  return event;
};

const createEvent = async ({
  hostId,
  name,
  date,
  venueId,
  status,
}: EventInput): Promise<Event> => {
  const newEvent = await prisma.event.create({
    data: {
      hostId,
      name,
      date: new Date(date),
      venueId,
      status,
      capacity: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return newEvent;
};

const updateEvent = async (
  id: string,
  eventUpdateInput: EventInput
): Promise<Event> => {
  const newUpdatedEvent = await prisma.event.update({
    where: { id },
    data: { ...eventUpdateInput, updatedAt: new Date() },
  });
  return newUpdatedEvent;
};

const deleteEvent = async (id: string): Promise<void> => {
  await prisma.event.delete({ where: { id } });
};

export default {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
