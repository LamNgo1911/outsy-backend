import prisma from '../config/prisma';
import { Feedback } from '@prisma/client';

// Create feedback
const createFeedback = async (
  userId: string,
  giverId: string,
  text: string
): Promise<Feedback> => {
  {
    const feedback = await prisma.feedback.create({
      data: {
        userId,
        giverId,
        text,
      },
    });

    if (feedback) {
      return feedback;
    }
    throw new Error('Failed to create feedback');
  }
};

// Get feedback received by a user
const getFeedbackReceived = async (userId: string): Promise<Feedback[]> => {
   const feedbacks = await prisma.feedback.findMany({
    where: { userId },
    include: { giver: true }, // Include giver details
  });
  if (feedbacks) {
    return feedbacks;
  }
  throw new Error('Failed to fetch feedback');
};

// Get feedback given by a user
const getFeedbackGiven = async (giverId: string): Promise<Feedback[]> => {
  const feedbacks = await prisma.feedback.findMany({
    where: { giverId },
    include: { user: true }, // Include recipient details
  });
  if (feedbacks) {
    return feedbacks;
  }
  throw new Error('Failed to fetch feedback');
};

// Delete feedback
const deleteFeedback = async (id: string): Promise<void> => {
  await prisma.feedback.delete({ where: { id } });
};

export default {
  createFeedback,
  getFeedbackReceived,
  getFeedbackGiven,
  deleteFeedback,
}