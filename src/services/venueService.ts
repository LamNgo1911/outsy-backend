import { Prisma } from "@prisma/client";
import prisma from "../config/prisma";
import { PaginationParams } from "../types/types";
import { Venue, VenueFilters, VenueInput } from "../types/venueTypes";
import { BadRequestError, NotFoundError } from "../error/apiError";

const venueCache = new Map<string, { venue: Venue; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const clearVenueCache = (venueId: string) => {
  venueCache.delete(venueId);
};

const getCachedVenue = (venueId: string): Venue | null => {
  const cached = venueCache.get(venueId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.venue;
  }
  venueCache.delete(venueId);
  return null;
};

const cacheVenue = (venue: Venue) => {
  venueCache.set(venue.id, { venue, timestamp: Date.now() });
};

const getAllVenues = async (
  filters: VenueFilters = {},
  pagination: PaginationParams = {}
): Promise<{ venues: Venue[]; total: number }> => {
  const { name, address, state, postalCode, city, country } = filters;

  const { page = 1, limit = 10 } = pagination;
  const skip = (page - 1) * limit;

  const where: Prisma.VenueWhereInput = {
    ...(state && { state }),
    ...(postalCode && { postalCode }),
    ...(city && { city }),
    ...(country && { country }),
    ...(name && {
      name: {
        contains: name,
        mode: Prisma.QueryMode.insensitive,
      },
    }),
    ...(address && {
      address: {
        contains: address,
        mode: Prisma.QueryMode.insensitive,
      },
    }),
  };

  const [venues, total] = await Promise.all([
    prisma.venue.findMany({
      where,
      skip,
      take: limit,
    }),
    prisma.venue.count({ where }),
  ]);

  return {
    venues,
    total,
  };
};

const getVenueById = async (venueId: string): Promise<Venue> => {
  const cachedVenue = getCachedVenue(venueId);
  if (cachedVenue) return cachedVenue;

  const venue = await prisma.venue.findUnique({ where: { id: venueId } });

  if (!venue) {
    throw new NotFoundError(`Venue ID ${venueId} can't be found!`);
  }

  cacheVenue(venue);
  return venue;
};


//NOTE - Temporary remove the venue reality verification
const createVenue = async ({
  name,
  address,
  postalCode,
  city,
  country,
  description,
  imageUrl,
}: VenueInput): Promise<Venue> => {
  const existingVenue = await prisma.venue.findFirst({
    where: {
      AND: {
        address,
        postalCode,
        city,
        country,
      },
    },
  });

  if (existingVenue) {
    throw new BadRequestError("This venue address has already existed!");
  }

  const newVenue = await prisma.venue.create({
    data: {
      name,
      address,
      postalCode,
      city,
      country,
      description,
      imageUrl,
    },
  });

  return newVenue;
};

//NOTE - Temporary remove the venue reality verification
const updateVenue = async (
  id: string,
  venueUpdateInput: VenueInput
): Promise<Venue> => {
  const venue = await prisma.venue.findUnique({ where: { id } });
  if (!venue) throw new NotFoundError("Venue not found");

  const newUpdatedVenue = await prisma.venue.update({
    where: { id },
    data: venueUpdateInput,
  });

  clearVenueCache(id);
  return newUpdatedVenue;
};

const deleteVenue = async (id: string): Promise<void> => {
  const venue = await prisma.venue.findUnique({ where: { id } });
  if (!venue) throw new NotFoundError("Venue not found");

  await prisma.venue.delete({ where: { id } });
  clearVenueCache(id);
};

export default {
  getVenueById,
  getAllVenues,
  createVenue,
  updateVenue,
  deleteVenue,
};
