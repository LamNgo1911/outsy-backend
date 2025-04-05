import { z } from "zod";

export const venueSchema = z.object({
  name: z.string().min(1, "Venue name is required"),
  address: z.string().min(1, "Address is required"),
  state: z.string().nullable(),
  postalCode: z.string().min(1, "Postal code is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  description: z.string().nullable(),
  imageUrl: z.string().url("Image URL must be valid").nullable(),
});

export const createVenueSchema = z.object({
  body: venueSchema,
});

export const updateVenueSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Venue ID is required"),
  }),
  body: venueSchema.partial(),
});

export const venueIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Venue ID is required"),
  }),
});