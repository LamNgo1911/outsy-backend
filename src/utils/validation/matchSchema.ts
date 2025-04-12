import { z } from "zod";

export const MatchStatusEnum = z.enum(["CONFIRMED", "COMPLETED", "CANCELLED"]);

export const matchCreateSchema = z.object({
  body: z.object({
    eventId: z.string().min(1, "Event ID is required"),
    guestId: z.string().min(1, "Guest ID is required"),
  }),
});

export const getMatchByIdSchema = z.object({
  params: z.object({
    matchId: z.string().min(1, "Match ID is required"),
  }),
});

export const getMatchByEventSchema = z.object({
  params: z.object({
    eventId: z.string().min(1, "Event ID is required"),
  }),
});

export const getMatchByUserSchema = z.object({
  params: z.object({
    userId: z.string().min(1, "User ID is required"),
  }),
});

export const matchUpdateSchema = z.object({
  params: z.object({
    matchId: z.string().min(1, "Match ID is required"),
  }),
  body: z.object({
    status: MatchStatusEnum.optional(),
  }),
});
