import { Prisma } from "@prisma/client";
import prisma from "../config/prisma";
import {
  EventFilters,
  Event,
  EventInput,
  EventUpdateInput,
} from "../types/eventTypes";
import { PaginationParams } from "../types/types";
import { BadRequestError, NotFoundError } from "../error/apiError";

const eventCache = new Map<string, { event: Event; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const clearEventCache = (eventId: string) => {
  eventCache.delete(eventId);
};

const getCachedEvent = (eventId: string): Event | null => {
  const cached = eventCache.get(eventId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.event;
  }
  eventCache.delete(eventId);
  return null;
};

const cacheEvent = (event: Event) => {
  eventCache.set(event.id, { event, timestamp: Date.now() });
};

const getEvents = async (
  filters: EventFilters = {},
  pagination: PaginationParams = {}
): Promise<{ events: Event[]; total: number }> => {
  const { type, status, venueId, dateRange } = filters;
  const { page = 1, limit = 10 } = pagination;
  const skip = (page - 1) * limit;

  const where: Prisma.EventWhereInput = {
    type,
    status,
    ...(dateRange && {
      date: {
        gte: new Date(dateRange.start),
        lte: new Date(dateRange.end),
      },
    }),
    ...(venueId && { venueId }),
  };

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      skip,
      take: limit,
      orderBy: { date: "asc" },
    }),
    prisma.event.count({ where }),
  ]);

  return { events, total };
};

const getEventById = async (eventId: string): Promise<Event> => {
  const cachedEvent = getCachedEvent(eventId);
  if (cachedEvent) return cachedEvent;

  const event = await prisma.event.findUnique({ where: { id: eventId } });

  if (!event) {
    throw new NotFoundError(`User ID ${eventId} not found.`);
  }

  cacheEvent(event);
  return event;
};

const createEvent = async ({
  hostId,
  name,
  date,
  venueId,
  status,
}: EventInput): Promise<Event> => {
  const venueExists = await prisma.venue.findUnique({
    where: {
      id: venueId,
    },
  });

  if (!venueExists) {
    throw new NotFoundError("No venue found with the provided Venue ID");
  }

  const eventDate = new Date(date);
  const now = new Date();

  if (eventDate < now) {
    throw new BadRequestError("The event date mustn't be in the past");
  }

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
  eventUpdateInput: EventUpdateInput
): Promise<Event> => {
  if (eventUpdateInput.venueId) {
    const venueExists = await prisma.venue.findUnique({
      where: {
        id: eventUpdateInput.venueId,
      },
    });

    if (!venueExists) {
      throw new NotFoundError("No venue found with the provided Venue ID");
    }
  }

  if (eventUpdateInput.date) {
    const eventDate = new Date(eventUpdateInput.date);
    const now = new Date();

    if (eventDate < now) {
      throw new BadRequestError("The event date mustn't be in the past");
    }
  }

  const newUpdatedEvent = await prisma.event.update({
    where: { id },
    data: { ...eventUpdateInput, updatedAt: new Date() },
  });

  clearEventCache(id);
  return newUpdatedEvent;
};

const deleteEvent = async (id: string): Promise<void> => {
  await prisma.event.delete({ where: { id } });

  clearEventCache(id);
};

export default {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
