import { PrismaClient } from "@prisma/client/extension";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  const { eventId } = req.params;
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });
    if (event) {
      res.status(200).json(event);
    } else {
      res.status(404).json({ message: "Event not found! " });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { hostId, eventName, eventDate, guestId, venueId, status } = req.body;
    const newEvent = await prisma.event.create({
      data: {
        hostId,
        name: eventName,
        date: eventDate,
        guestId,
        venueId,
        status,
      },
    });
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { hostId, eventName, eventDate, guestId, venueId } = req.body;
    const updatedEvent = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: { hostId, name: eventName, date: eventDate, guestId, venueId },
    });
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const changeEventStatus = async (req: Request, res: Response) => {
    try {
      const { eventId } = req.params;
      const { status } = req.body;
      const updatedEvent = await prisma.event.update({
        where: {
          id: eventId,
        },
        data: { status },
      });
      res.status(200).json(updatedEvent);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };