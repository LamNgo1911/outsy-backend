import { EventStatus, EventType } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import eventService from "../services/eventService";
import venueService from "../services/venueService";
import { Result } from "../utils/Result";
import { EventFilters, EventInput } from "../types/eventTypes";
import { PaginationParams } from "../types/types";

export const getEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      type,
      status,
      dateRange,
      venueId,
      hostId,
      page,
      limit,
    } = req.query;

    const filters: EventFilters = {
      ...(type && { type: type as EventType }),
      ...(status && { status: status as EventStatus }),
      ...(dateRange && { dateRange: {
        start: new Date((dateRange as string).split(",")[0]),
        end: new Date((dateRange as string).split(",")[1])
      } }),
      ...(venueId && { venueId: venueId as string }),
      ...(hostId && { hostId: hostId as string }),
    };

    const pagination: PaginationParams = {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    };

    const result = await eventService.getEvents(filters, pagination);
    const serverResponse = Result.success(result);
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
