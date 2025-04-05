import { z } from "zod";

export const LikeStatusEnum = z.enum(["PENDING", "ACCEPTED", "REJECTED"]);

export const eventLikeCreateSchema = z.object({
  body: z.object({
    userId: z.string().min(1, "Host ID is required"),
    eventId: z.string().min(1, "Event ID is required"),
    message: z.string().optional(),
    status: LikeStatusEnum.default("PENDING"),
  }),
});

export const eventLikeIdSchema = z.object({
  params: z.object({
    eventLikeId: z.string().min(1, "EventLike ID is required"),
  }),
});

export const allEventLikeSchema = z.object({
  params: z.object({
    userId: z.string().min(1, "User ID is required"),
  }),
});

export const eventLikeUpdateSchema = z.object({
  params: z.object({
    eventLikeId: z.string().min(1, "EventLike ID is required"),
  }),
  body: z.object({
    status: LikeStatusEnum.optional(),
    message: z.string().optional(),
  }),
});
