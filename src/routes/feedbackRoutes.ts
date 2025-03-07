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
router.get('/:userId/feedback/received', getFeedbackReceived);

// Get feedback given by a user
router.get('/:userId/feedback/given', getFeedbackGiven);

// Delete feedback
router.delete('/:feedbackId', deleteFeedback);

export default router;
