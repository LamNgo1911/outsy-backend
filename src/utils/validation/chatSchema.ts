import z from 'zod';

export const chatIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Chat ID is required'),
  }),
});

export const chatUpdateSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Chat ID is required'),
  }),
  body: z.object({
    isActive: z.boolean().optional(),
  }),
});

export const chatQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    isActive: z.string().optional(),
  }),
});

