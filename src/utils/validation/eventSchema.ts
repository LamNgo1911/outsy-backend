import { z } from "zod";

export const EventTypeEnum = z.enum(["FOOD", "DRINKS", "ACTIVITY", "OTHER"]);
export const EventStatusEnum = z.enum(["OPEN", "CLOSED", "CANCELLED"]);

export const eventSchema = z.object({
  hostId: z.string().min(1, "Host ID is required"),
  name: z.string().min(1, "Event name is required"),
  description: z.string().optional(),
  type: EventTypeEnum.default("FOOD"),
  date: z.string().transform((str) => new Date(str)),
  venueId: z.string().min(1, "Venue ID is required"),
  status: EventStatusEnum.default("OPEN"),
  capacity: z.number().int().min(1).default(2),
})

export const eventIdSchema = z.object({
  params: z.object({
    eventId: z.string().min(1, "User ID is required"),
  }),
});

export const eventCreateSchema = z.object({
  body: eventSchema,
});

export const eventUpdateSchema = z.object({
  params: z.object({
    eventId: z.string().min(1, "Event ID is required"),
  }),
  body: eventSchema.partial(),
});