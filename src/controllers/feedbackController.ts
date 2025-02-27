import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create feedback
export const createFeedback = async (req: Request, res: Response) => {
  const { userId, giverId, text } = req.body;

  try {
    const feedback = await prisma.feedback.create({
      data: {
        userId,
        giverId,
        text,
      },
    });
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create feedback' });
  }
};

// Get feedback received by a user
export const getFeedbackReceived = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const feedback = await prisma.feedback.findMany({
      where: { userId },
      include: { giver: true }, // Include giver details
    });
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
};

// Get feedback given by a user
export const getFeedbackGiven = async (req: Request, res: Response) => {
  const { giverId } = req.params;

  try {
    const feedback = await prisma.feedback.findMany({
      where: { giverId },
      include: { user: true }, // Include recipient details
    });
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
};

// Delete feedback
export const deleteFeedback = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.feedback.delete({
      where: { id },
    });
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
};