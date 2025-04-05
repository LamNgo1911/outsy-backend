import { NextFunction, Request, Response } from "express";
import { VenueInput } from "../types/venueTypes";
import venueService from "../services/venueService";
import { Result } from "../utils/Result";

export const getAllVenues = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, address, state, postalCode, city, country, page, limit } =
      req.query;

    const filters = {
      ...(state && { state: state as string }),
      ...(postalCode && { postalCode: postalCode as string }),
      ...(city && { city: city as string }),
      ...(country && { country: country as string }),
      ...(name && {
        name: name as string,
      }),
      ...(address && {
        address: address as string,
      }),
    };

    const pagination = {
      ...(page && { page: parseInt(page as string) }),
      ...(limit && { limit: parseInt(limit as string) }),
    };

    const venues = await venueService.getAllVenues(filters, pagination);
    const serverResponse = Result.success(venues);
    const { statusCode, body } = serverResponse.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error);
  }
};

export const getVenueById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { venueId } = req.params;
    const venue = await venueService.getVenueById(venueId);
    const response = Result.success(venue);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error);
  }
};

export const createVenue = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      name,
      address,
      state,
      postalCode,
      city,
      country,
      description,
      imageUrl,
    } = req.body;

    const newVenue = await venueService.createVenue({
      name,
      address,
      state,
      postalCode,
      city,
      country,
      description,
      imageUrl,
    });
    const response = Result.success(newVenue, 201);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error);
  }
};

export const updateVenue = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { venueId } = req.params;
    const requestedData: VenueInput = req.body;

    const updatedVenue = await venueService.updateVenue(venueId, requestedData);
    const response = Result.success(updatedVenue);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error);
  }
};

export const deleteVenue = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { venueId } = req.params;

    await venueService.deleteVenue(venueId);
    const response = Result.success(null, 204);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error);
  }
};
