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
  // Optional validation
  if (!userId) throw new Error('User ID is required');
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
  // Optional validation
  if (!giverId) throw new Error('Giver ID is required');
  const feedbacks = await prisma.feedback.findMany({
    where: { giverId },
    include: { user: true }, // Include recipient details
  });
  if (feedbacks) {
    return feedbacks;
  }
  throw new Error('Failed to fetch feedback');
};

// Update feedback
const updateFeedback = async (
  id: string,
  giverId: string,
  text: string
): Promise<Feedback> => {
  const feedback = await prisma.feedback.findUnique({
    where: { id },
  });

  // Check if feedback exists or giverId matches
  if (!feedback) {
    throw new Error('Feedback not found');
  }

  if (feedback.giverId !== giverId) {
    throw new Error('You are not authorized to update this feedback');
  }

  // Update the feedback
  const updatedFeedback = await prisma.feedback.update({
    where: { id },
    data: { text },
  });

  if (updatedFeedback) {
    return updatedFeedback;
  }
  throw new Error('Failed to update feedback');
};

// Delete feedback
const deleteFeedback = async (id: string): Promise<void> => {
  await prisma.feedback.delete({ where: { id } });
};

export default {
  createFeedback,
  getFeedbackReceived,
  getFeedbackGiven,
  updateFeedback,
  deleteFeedback,
};