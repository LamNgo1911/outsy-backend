import express from 'express';
import {
  createFeedback,
  getFeedbackReceived,
  getFeedbackGiven,
  updateFeedback,
  deleteFeedback,
} from '../controllers/feedbackController';

const router = express.Router();

// Create feedback
router.post('/', createFeedback);

// Get feedback received by a user
router.get('/received', getFeedbackReceived);

// Get feedback given by a user
router.get('/given', getFeedbackGiven);

// Update feedback
router.put('/:id', updateFeedback);

// Delete feedback
router.delete('/:id', deleteFeedback);

export default router;
