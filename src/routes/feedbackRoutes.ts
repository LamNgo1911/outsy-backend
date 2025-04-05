import express from 'express';
import {
  createFeedback,
  getFeedbackReceived,
  getFeedbackGiven,
  deleteFeedback,
  updateFeedback,
} from '../controllers/feedbackController';
import { validateRequest } from '../middlewares/validateRequest';
import { authMiddleware } from '../middlewares/authMiddleware';
import { z } from 'zod';

const router = express.Router();

// Validation schemas
const feedbackIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Feedback ID is required'),
  }),
});

const feedbackCreateSchema = z.object({
  body: z.object({
    userId: z.string().min(1, 'User ID is required'),
    giverId: z.string().min(1, 'Giver ID is required'),
    text: z.string().min(1, 'Feedback text is required'),
  }),
});

const feedbackUpdateSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Feedback ID is required'),
  }),
  body: z.object({
    text: z.string().min(1, 'Feedback text is required'),
  }),
});

// Pagination and filtering schema for GET routes
const feedbackQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : 10)),
    sortBy: z.enum(['createdAt', 'text']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Create feedback
router.post('/', validateRequest(feedbackCreateSchema), createFeedback);

// Get feedback received by a user
router.get(
  '/received',
  validateRequest(feedbackQuerySchema),
  getFeedbackReceived
);

// Get feedback given by a user
router.get('/given', validateRequest(feedbackQuerySchema), getFeedbackGiven);

// Update feedback
router.put('/:id', validateRequest(feedbackUpdateSchema), updateFeedback);

// Delete feedback
router.delete('/:id', validateRequest(feedbackIdSchema), deleteFeedback);

export default router;
