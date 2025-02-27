import prisma from "../config/prisma";
import { Event, EventCreationInput, EventUpdateInput } from "./types";

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
  eventName,
  eventDate,
  guestId,
  venueId,
  status,
}: EventCreationInput): Promise<Event> => {
  const newEvent = await prisma.event.create({
    data: {
      hostId,
      name: eventName,
      date: new Date(eventDate),
      guestId,
      venueId,
      status,
    },
  });

  return newEvent;
};

const updateEvent = async (
  id: string,
  eventUpdateInput: EventUpdateInput
): Promise<Event> => {
  const newUpdatedEvent = await prisma.event.update({
    where: { id },
    data: eventUpdateInput,
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
