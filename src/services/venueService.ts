import prisma from "../config/prisma";
import { Venue } from "../types/types";

const getVenueById = async (venueId: string): Promise<Venue> => {
  const venue = await prisma.venue.findUnique({ where: { id: venueId } });
  if (!venue) {
    throw new Error(`Venue ID ${venueId} can't be found!`);
  }
  return venue;
};

export default { getVenueById };
