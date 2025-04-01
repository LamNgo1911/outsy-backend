import { NextFunction, Request, Response } from "express";
import { EventLikeInput } from "../types/eventTypes";
import eventLikeService from "../services/eventLikeService";
import { Result } from "../utils/Result";

export const getAllLikedEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userId } = req.params;
  try {
    const allLikedEvents = await eventLikeService.getAllLikedEvent(userId);
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
  const { eventLikeId } = req.params;
  try {
    const eventLike = await eventLikeService.getSpecificLikedEvent(eventLikeId);
    if (eventLike) {
      res.status(200).json(eventLike);
    } else {
      res.status(404).json({ message: "The liked event was not found! " });
    }
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

    const newEvent = await eventLikeService.createLikeEvent({
      ...newEventLikeRequestBody,
    });
    res.status(201).json(newEvent);
  } catch (error) {
    next(error);
    console.log(error);
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

    const updatedEvent = await eventLikeService.updateLikedEventStatus(
      eventLikeId,
      status
    );
    res.status(204).json(updatedEvent);
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
    res
      .status(200)
      .json({ message: `Delete liked event ${eventLikeId} successfully.` });
  } catch (error) {
    next(error);
  }
};
