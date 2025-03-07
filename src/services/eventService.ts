import prisma from "../config/prisma";
import { Event, EventInput } from "../types/types";

const getEvents = async (): Promise<Event[]> => {
  const events = await prisma.event.findMany();
  return events;
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
