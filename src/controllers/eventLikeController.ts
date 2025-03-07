import { EventStatus, LikeStatus } from "@prisma/client";
import { Request, Response } from "express";
import { EventInput, EventLikeInput } from "../types/types";
import eventLikeService from "../services/eventLikeService";

export const getAllLikedEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  try {
    const allLikedEvents = await eventLikeService.getAllLikedEvent(userId);
    res.status(200).json(allLikedEvents);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getLikedEventById = async (
  req: Request,
  res: Response
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
    res.status(500).json({ error: error });
  }
};

export const createLikedEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newEventLikeRequestBody: EventLikeInput = req.body;

    const newEvent = await eventLikeService.createLikeEvent({
      ...newEventLikeRequestBody,
    });
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: error });
    console.log(error);
  }
};

export const updateLikedEventStatus = async (
  req: Request,
  res: Response
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
    res.status(500).json({ error: error });
  }
};

export const deleteLikedEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { eventLikeId } = req.params;

    await eventLikeService.deleteLikedEvent(eventLikeId);
    res
      .status(200)
      .json({ message: `Delete liked event ${eventLikeId} successfully.` });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
