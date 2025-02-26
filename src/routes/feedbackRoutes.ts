import express from 'express';
import {
  createFeedback,
  getFeedbackReceived,
  getFeedbackGiven,
  deleteFeedback,
} from '../controllers/feedbackController';

const router = express.Router();

// Create feedback
router.post('/feedback', createFeedback);

// Get feedback received by a user
router.get('/users/:userId/feedback/received', getFeedbackReceived);

// Get feedback given by a user
router.get('/users/:giverId/feedback/given', getFeedbackGiven);

// Delete feedback
router.delete('/feedback/:id', deleteFeedback);

export default router;
