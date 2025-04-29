import { NextFunction, Request, Response } from 'express';
import feedbackService from '../services/feedbackService';
import { FeedbackFilters, FeedbackInput } from '../types/feedbackTypes';
import { PaginationParams } from '../types/types';
import { Result } from '../utils/Result';

// Create feedback
export const createFeedback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const feedbackData: FeedbackInput = req.body;
    const feedback = await feedbackService.createFeedback(
      feedbackData.userId,
      feedbackData.giverId,
      feedbackData.text
    );
    const response = Result.success(feedback, 201);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error);
  }
};

// Get feedback received by a user
export const getFeedbackReceived = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { dateRange, page, limit, sortBy, sortOrder } = req.query;
    const dateRangeArray = dateRange ? (dateRange as string).split(',') : [];

    const filters: FeedbackFilters = {
      userId,
      ...(dateRange && {
        dateRange: {
          start: new Date(dateRangeArray[0]),
          end: new Date(dateRangeArray[1]),
        },
      }),
    };

    const pagination: PaginationParams = {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      sortBy: sortBy as string | undefined,
      sortOrder: sortOrder as 'asc' | 'desc' | undefined,
    };

    const result = await feedbackService.getFeedbackReceived(
      userId,
      filters,
      pagination
    );
    const serverResponse = Result.success(result);
    const { statusCode, body } = serverResponse.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error);
  }
};

// Get feedback given by a user
export const getFeedbackGiven = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { giverId } = req.params;
    const { dateRange, page, limit, sortBy, sortOrder } = req.query;
    const dateRangeArray = dateRange ? (dateRange as string).split(',') : [];

    const filters: FeedbackFilters = {
      giverId,
      ...(dateRange && {
        dateRange: {
          start: new Date(dateRangeArray[0]),
          end: new Date(dateRangeArray[1]),
        },
      }),
    };

    const pagination: PaginationParams = {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      sortBy: sortBy as string | undefined,
      sortOrder: sortOrder as 'asc' | 'desc' | undefined,
    };

    const result = await feedbackService.getFeedbackGiven(
      giverId,
      filters,
      pagination
    );
    const serverResponse = Result.success(result);
    const { statusCode, body } = serverResponse.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error);
  }
};

// Delete feedback
export const deleteFeedback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await feedbackService.deleteFeedback(id);
    const response = Result.success(null, 204);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error);
  }
};

// Update feedback
export const updateFeedback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const feedback = await feedbackService.updateFeedback(id, text);
    const response = Result.success(feedback);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error);
  }
};

export default {
  createFeedback,
  getFeedbackReceived,
  getFeedbackGiven,
  deleteFeedback,
  updateFeedback,
};
