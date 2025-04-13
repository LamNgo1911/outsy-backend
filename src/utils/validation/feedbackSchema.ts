import z from 'zod';

export const feedbackIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Feedback ID is required'),
  }),
});

export const feedbackCreateSchema = z.object({
  body: z.object({
    userId: z.string().min(1, 'User ID is required'),
    giverId: z.string().min(1, 'Giver ID is required'),
    text: z.string().min(1, 'Feedback text is required'),
  }),
});

export const feedbackUpdateSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Feedback ID is required'),
  }),
  body: z.object({
    text: z.string().min(1, 'Feedback text is required'),
  }),
});

// Query parameters schema with default values and transformations
export const feedbackQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : 10)),
    sortBy: z.enum(['createdAt']).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
    dateRange: z.string().optional(),
  }),
});

// User ID schema
export const userIdSchema = z.object({
  params: z.object({
    userId: z.string().min(1, 'User ID is required'),
  }),
});

// Giver ID schema
export const giverIdSchema = z.object({
  params: z.object({
    giverId: z.string().min(1, 'Giver ID is required'),
  }),
});

// Combined schemas for GET routes
export const feedbackReceivedSchema = userIdSchema.merge(feedbackQuerySchema);
export const feedbackGivenSchema = giverIdSchema.merge(feedbackQuerySchema);
