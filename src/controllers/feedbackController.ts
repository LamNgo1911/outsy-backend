import { Request, Response } from 'express';
import feedbackService from '../services/feedbackService';

// Create feedback
export const createFeedback = async (req: Request, res: Response) => {
  const { userId, giverId, text } = req.body;

  try {
    const feedback = await feedbackService.createFeedback(
      userId,
      giverId,
      text
    );
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Get feedback received by a user
export const getFeedbackReceived = async (req: Request, res: Response) => {
  const { userId } = req.body;
  
  // These are already validated by the route middleware
  const { page, limit, sortBy, sortOrder } = req.query; 

  try {
    const result = await feedbackService.getFeedbackReceived(
      userId,
      Number(page) || 1,
      Number(limit) || 10,
      (sortBy as string) || 'createdAt',
      (sortOrder as 'asc' | 'desc') || 'desc'
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Get feedback given by a user
export const getFeedbackGiven = async (req: Request, res: Response) => {
  const { giverId } = req.body;
  const { page, limit, sortBy, sortOrder } = req.query;

  try {
    const result = await feedbackService.getFeedbackGiven(
      giverId,
      Number(page) || 1,
      Number(limit) || 10,
      (sortBy as string) || 'createdAt',
      (sortOrder as 'asc' | 'desc') || 'desc'
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Update feedback
export const updateFeedback = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { giverId, text } = req.body;

  try {
    const feedback = await feedbackService.updateFeedback(id, giverId, text);
    res.status(200).json(feedback);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
};

// Delete feedback
export const deleteFeedback = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await feedbackService.deleteFeedback(id);
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ error });
  }
};
