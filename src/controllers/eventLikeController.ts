import { NextFunction, Request, Response } from "express";
import { EventLikeFilters, EventLikeInput } from "../types/eventTypes";
import eventLikeService from "../services/eventLikeService";
import { Result } from "../utils/Result";
import { EventStatus, EventType, LikeStatus } from "@prisma/client";
import { PaginationParams } from "../types/types";

export const getAllLikedEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { type, status, venueId, dateRange, likeStatus, page, limit } =
      req.query;
    const filters: EventLikeFilters = {
      ...(type && { type: type as EventType }),
      ...(status && { status: status as EventStatus }),
      ...(dateRange && {
        dateRange: {
          start: new Date((dateRange as string).split(",")[0]),
          end: new Date((dateRange as string).split(",")[1]),
        },
      }),
      ...(venueId && { venueId: venueId as string }),
      ...(likeStatus && { likeStatus: likeStatus as LikeStatus }),
    };

    const pagination: PaginationParams = {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    };

    const allLikedEvents = await eventLikeService.getAllLikedEvent(
      userId,
      filters,
      pagination
    );
    const serverResponse = Result.success(allLikedEvents);
    const { statusCode, body } = serverResponse.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error);
  }
};

export const getLikedEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { eventLikeId } = req.params;
    const eventLike = await eventLikeService.getSpecificLikedEvent(eventLikeId);

    const serverResponse = Result.success(eventLike);
    const { statusCode, body } = serverResponse.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error);
  }
};

export const createLikedEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newEventLikeRequestBody: EventLikeInput = req.body;

    const newLikedEvent = await eventLikeService.createLikeEvent({
      ...newEventLikeRequestBody,
    });

    const response = Result.success(newLikedEvent, 201);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error);
  }
};

export const updateLikedEventStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { eventLikeId } = req.params;
    const { status } = req.body;

    const updatedLikedEvent = await eventLikeService.updateLikedEventStatus(
      eventLikeId,
      status
    );

    const response = Result.success(updatedLikedEvent);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error);
  }
};

export const deleteLikedEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { eventLikeId } = req.params;

    await eventLikeService.deleteLikedEvent(eventLikeId);

    const response = Result.success(null, 204);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error);
  }
};
