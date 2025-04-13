import prisma from '../config/prisma';
import { Feedback } from '@prisma/client';
import { FeedbackFilters, FeedbackResponse } from '../types/feedbackTypes';
import { PaginationParams } from '../types/types';

// Create feedback
const createFeedback = async (
  userId: string,
  giverId: string,
  text: string
): Promise<Feedback> => {
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
};

// Get feedback received by a user
const getFeedbackReceived = async (
  userId: string,
  filters: FeedbackFilters = {},
  pagination: PaginationParams = {}
): Promise<FeedbackResponse> => {
  const { dateRange } = filters;

  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = pagination;

  const skip = (page - 1) * limit;

  // Build where clause for filtering
  const where: any = { userId };
  if (dateRange) {
    where.createdAt = {
      gte: dateRange.start,
      lte: dateRange.end,
    };
  }

  const [feedbacks, total] = await Promise.all([
    prisma.feedback.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    }),
    prisma.feedback.count({ where }),
  ]);

  return { feedbacks, total };
};

// Get feedback given by a user
const getFeedbackGiven = async (
  giverId: string,
  filters: FeedbackFilters = {},
  pagination: PaginationParams = {}
): Promise<FeedbackResponse> => {
  const { dateRange } = filters;
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = pagination;

  const skip = (page - 1) * limit;

  // Build where clause for filtering
  const where: any = { giverId };
  if (dateRange) {
    where.createdAt = {
      gte: dateRange.start,
      lte: dateRange.end,
    };
  }

  const [feedbacks, total] = await Promise.all([
    prisma.feedback.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    }),
    prisma.feedback.count({ where }),
  ]);

  return { feedbacks, total };
};

// Delete feedback
const deleteFeedback = async (id: string): Promise<void> => {
  await prisma.feedback.delete({
    where: { id },
  });
};

// Update feedback
const updateFeedback = async (id: string, text: string): Promise<Feedback> => {
  const feedback = await prisma.feedback.update({
    where: { id },
    data: { text },
  });

  if (feedback) {
    return feedback;
  }
  throw new Error('Failed to update feedback');
};

export default {
  createFeedback,
  getFeedbackReceived,
  getFeedbackGiven,
  deleteFeedback,
  updateFeedback,
};
