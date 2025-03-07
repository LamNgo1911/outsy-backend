import prisma from "../config/prisma";
import { Venue, VenueInput } from "../types/types";

const getAllVenues = async (): Promise<Venue[]> => {
  const venues = await prisma.venue.findMany();
  return venues;
};

const getVenueById = async (venueId: string): Promise<Venue> => {
  const venue = await prisma.venue.findUnique({ where: { id: venueId } });
  if (!venue) {
    throw new Error(`Venue ID ${venueId} can't be found!`);
  }
  return venue;
};

const createVenue = async ({
  name,
  address,
  postalCode,
  city,
  country,
  description,
  imageUrl
}: VenueInput): Promise<Venue> => {
  const newVenue = await prisma.venue.create({
    data: {
      name,
      address,
      postalCode,
      city,
      country,
      description,
      imageUrl
    },
  });

  return newVenue;
};

const updateVenue = async (
  id: string,
  venueUpdateInput: VenueInput
): Promise<Venue> => {
  const newUpdatedVenue = await prisma.venue.update({
    where: { id },
    data: venueUpdateInput,
  });

  return newUpdatedVenue;
};

const deleteVenue = async (id: string): Promise<void> => {
  await prisma.venue.delete({ where: { id } });
};

export default {
  getVenueById,
  getAllVenues,
  createVenue,
  updateVenue,
  deleteVenue,
};
