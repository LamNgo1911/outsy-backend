import { EventStatus, EventType } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import eventService from "../services/eventService";
import { Result } from "../utils/Result";
import { EventFilters, EventInput, EventUpdateInput } from "../types/eventTypes";
import { PaginationParams } from "../types/types";

export const getEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type, status, dateRange, venueId, page, limit } = req.query;

    const filters: EventFilters = {
      ...(type && { type: type as EventType }),
      ...(status && { status: status as EventStatus }),
      ...(dateRange && {
        dateRange: {
          start: new Date((dateRange as string).split(",")[0]),
          end: new Date((dateRange as string).split(",")[1]),
        },
      }),
      ...(venueId && { venueId: venueId as string })
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

    const newEvent = await eventService.createEvent({
      ...newEventRequestBody,
      status: EventStatus.OPEN,
    });

    const response = Result.success(newEvent, 201);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
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
    const requestedData: EventUpdateInput = req.body;

    const updatedEvent = await eventService.updateEvent(eventId, requestedData);
    const response = Result.success(updatedEvent);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
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
    const response = Result.success(null, 204);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error);
  }
};
