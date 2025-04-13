import express from 'express';
import {
  createFeedback,
  deleteFeedback,
  getFeedbackGiven,
  getFeedbackReceived,
  updateFeedback,
} from '../controllers/feedbackController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import {
  feedbackIdSchema,
  feedbackCreateSchema,
  feedbackUpdateSchema,
  feedbackReceivedSchema,
  feedbackGivenSchema,
} from '../utils/validation/feedbackSchema';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Create feedback
router.post('/', validateRequest(feedbackCreateSchema), createFeedback);

// Get feedback received by a user
router.get(
  '/received/:userId',
  validateRequest(feedbackReceivedSchema),
  getFeedbackReceived
);

// Get feedback given by a user
router.get(
  '/given/:giverId',
  validateRequest(feedbackGivenSchema),
  getFeedbackGiven
);

// Update feedback
router.put('/:id', validateRequest(feedbackUpdateSchema), updateFeedback);

// Delete feedback
router.delete('/:id', validateRequest(feedbackIdSchema), deleteFeedback);

export default router;
