import { EventStatus } from "@prisma/client";
import { Request, Response } from "express";
import { EventUpdateInput } from "../services/types";
import eventService from "../services/eventService";
import venueService from "../services/venueService";

export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await eventService.getEvents();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getEventById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { eventId } = req.params;
  try {
    const event = await eventService.getEventById(eventId);
    if (event) {
      res.status(200).json(event);
    } else {
      res.status(404).json({ message: "Event not found! " });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const createEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { hostId, eventName, eventDate, guestId, venueId } = req.body;

    const venueExists = await venueService.getVenueById(venueId);

    if (venueExists) {
      const newEvent = await eventService.createEvent({
        hostId,
        eventName,
        eventDate,
        guestId,
        venueId,
        status: EventStatus.OPEN,
      });
      res.status(201).json(newEvent);
    } else {
      res.status(404).json({
        error: `Can't find venue with id ${venueId}`,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error });
    console.log(error);
  }
};

export const updateEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { eventId } = req.params;
    const requestedData: EventUpdateInput = req.body;

    const venueExists = await venueService.getVenueById(requestedData.venueId);

    if (venueExists) {
      const updatedEvent = await eventService.updateEvent(
        eventId,
        requestedData
      );
      res.status(204).json(updatedEvent);
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const deleteEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { eventId } = req.params;

    await eventService.deleteEvent(eventId);
    res.status(200).json({ message: `Delete event ${eventId} successfully.` });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
