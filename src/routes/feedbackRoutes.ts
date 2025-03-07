import express from 'express';
import {
  createFeedback,
  getFeedbackReceived,
  getFeedbackGiven,
  deleteFeedback,
} from '../controllers/feedbackController';

const router = express.Router();

// Create feedback
router.post('/', createFeedback);

// Get feedback received by a user
router.get('received/:userId', getFeedbackReceived);

// Get feedback given by a user
router.get('given/:userId', getFeedbackGiven);

// Delete feedback
router.delete('/:id', deleteFeedback);

export default router;
