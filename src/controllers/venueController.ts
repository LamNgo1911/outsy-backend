import { Request, Response } from "express";
import { VenueInput } from "../types/types";
import venueService from "../services/venueService";

export const getAllVenues = async (req: Request, res: Response): Promise<void> => {
  try {
    const venues = await venueService.getAllVenues();
    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getVenueById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { venueId } = req.params;
  try {
    const venue = await venueService.getVenueById(venueId);
    if (venue) {
      res.status(200).json(venue);
    } else {
      res.status(404).json({ message: `Venue with ${venueId} not found! ` });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const createVenue = async (
  req: Request,
  res: Response
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

    const newvenue = await venueService.createVenue({
      name,
      address,
      state,
      postalCode,
      city,
      country,
      description,
      imageUrl,
    });
    res.status(201).json(newvenue);
  } catch (error) {
    res.status(500).json({ error: error });
    console.log(error);
  }
};

export const updateVenue = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { venueId } = req.params;
    const requestedData: VenueInput = req.body;

    const updatedVenue = await venueService.updateVenue(venueId, requestedData);
    res.status(204).json(updatedVenue);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const deleteVenue = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { venueId } = req.params;

    await venueService.deleteVenue(venueId);
    res.status(200).json({ message: `Delete venue ${venueId} successfully.` });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
