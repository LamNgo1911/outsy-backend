import { z } from "zod";

export const EventTypeEnum = z.enum(["FOOD", "DRINKS", "ACTIVITY", "OTHER"]);
export const EventStatusEnum = z.enum(["OPEN", "CLOSED", "CANCELLED"]);

export const eventIdSchema = z.object({
  params: z.object({
    eventId: z.string().min(1, "User ID is required"),
  }),
});

export const eventCreateSchema = z.object({
  body: z.object({
    hostId: z.string().min(1, "Host ID is required"),
    name: z.string().min(1, "Event name is required"),
    description: z.string().optional(),
    type: EventTypeEnum.default("FOOD"),
    date: z.string().transform((str) => new Date(str)),
    venueId: z.string().min(1, "Venue ID is required"),
    status: EventStatusEnum.default("OPEN"),
    capacity: z.number().int().min(1).default(2),
  }),
});

export const eventUpdateSchema = z.object({
  params: z.object({
    eventId: z.string().min(1, "Event ID is required"),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional().nullable(),
    type: EventTypeEnum.optional(),
    date: z.string().transform((str) => new Date(str)),
    venueId: z.string().cuid().optional(),
    status: EventStatusEnum.optional(),
    capacity: z.number().int().min(1).optional(),
  }),
});
