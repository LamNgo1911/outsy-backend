import { EventStatus } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { EventInput } from "../types/types";
import eventService from "../services/eventService";
import venueService from "../services/venueService";
import { Result } from "../utils/Result";

export const getEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const events = await eventService.getEvents();
    const serverResponse = Result.success(events);
    const { statusCode, body } = serverResponse.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { eventId } = req.params;
  try {
    const event = await eventService.getEventById(eventId);
    const serverResponse = Result.success(event);
    const { statusCode, body } = serverResponse.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newEventRequestBody: EventInput = req.body;

    const venueExists = await venueService.getVenueById(
      newEventRequestBody.venueId
    );

    if (venueExists) {
      const newEvent = await eventService.createEvent({
        ...newEventRequestBody,
        status: EventStatus.OPEN,
      });
      res.status(201).json(newEvent);
    }
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { eventId } = req.params;
    const requestedData: EventInput = req.body;

    const venueExists = await venueService.getVenueById(requestedData.venueId);

    if (venueExists) {
      const updatedEvent = await eventService.updateEvent(
        eventId,
        requestedData
      );
      res.status(204).json(updatedEvent);
    }
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { eventId } = req.params;

    await eventService.deleteEvent(eventId);
    res.status(200).json({ message: `Delete event ${eventId} successfully.` });
  } catch (error) {
    next(error);
  }
};
