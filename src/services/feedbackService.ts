import prisma from '../config/prisma';
import { Feedback } from '@prisma/client';

// Define types for the selected fields
type FeedbackWithGiverId = {
  id: string;
  text: string;
  createdAt: Date;
  giverId: string;
};

type FeedbackWithUserId = {
  id: string;
  text: string;
  createdAt: Date;
  userId: string;
};

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
const getFeedbackReceived = async (
  userId: string,
  page: number = 1,
  limit: number = 10,
  sortBy: string = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<{ feedbacks: FeedbackWithGiverId[]; total: number }> => {
  // Optional validation
  if (!userId) throw new Error('User ID is required');

  // Calculate skip for pagination
  const skip = (page - 1) * limit;

  // Get total count and feedbacks in parallel
  const [feedbacks, total] = await Promise.all([
    prisma.feedback.findMany({
      where: { userId },
      // include: { giver: true },
      select: {
        id: true,
        text: true,
        createdAt: true,
        giverId: true,
      },
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    }),
    prisma.feedback.count({
      where: { userId },
    }),
  ]);

  if (feedbacks) {
    return { feedbacks, total };
  }
  throw new Error('Failed to fetch feedback');
};

// Get feedback given by a user
const getFeedbackGiven = async (
  giverId: string,
  page: number = 1,
  limit: number = 10,
  sortBy: string = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<{ feedbacks: FeedbackWithUserId[]; total: number }> => {
  // Optional validation
  if (!giverId) throw new Error('Giver ID is required');

  // Calculate skip for pagination
  const skip = (page - 1) * limit;

  // Get total count and feedbacks in parallel
  const [feedbacks, total] = await Promise.all([
    prisma.feedback.findMany({
      where: { giverId },
      select: {
        id: true,
        text: true,
        createdAt: true,
        userId: true,
      },
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    }),
    prisma.feedback.count({
      where: { giverId },
    }),
  ]);

  if (feedbacks) {
    return { feedbacks, total };
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