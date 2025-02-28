import { Request, Response } from 'express';
import feedbackService from '../services/feedbackService';

// Create feedback
export const createFeedback = async (req: Request, res: Response) => {
  const { userId, giverId, text } = req.body;

  try {
    const feedback = await feedbackService.createFeedback(userId, giverId, text);
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create feedback' });
  }
};

// Get feedback received by a user
export const getFeedbackReceived = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const feedbacks = await feedbackService.getFeedbackReceived(userId);
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
};

// Get feedback given by a user
export const getFeedbackGiven = async (req: Request, res: Response) => {
  const { giverId } = req.params;

  try {
    const feedbacks = await feedbackService.getFeedbackGiven(giverId);
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
};

// Delete feedback
export const deleteFeedback = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await feedbackService.deleteFeedback(id);
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
};