import { NextFunction, Request, Response } from 'express';
import chatService from '../services/chatService';
import { Result } from '../utils/Result';
import { PaginationParams } from '../types/types';
import { ChatFilters, ChatInput } from '../types/chatTypes';

export const getChats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { isActive, dateRange, page, limit, sortBy, sortOrder } = req.query;
    const dateRangeArray = dateRange ? (dateRange as string).split(',') : [];

    const filters: ChatFilters = {
      ...(isActive !== undefined && {
        isActive: isActive === 'true' ? true : false,
      }),
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

    const result = await chatService.getChats(filters, pagination);
    const response = Result.success(result);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error);
  }
};

export const getChatById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const chat = await chatService.getChatById(id);
    const response = Result.success(chat);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error);
  }
};

export const createChat = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const chat = await chatService.createChat();
    const response = Result.success(chat, 201);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error);
  }
};

export const updateChat = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: ChatInput = req.body;
    const chat = await chatService.updateChat(id, updateData);
    const response = Result.success(chat);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error);
  }
};

export const deleteChat = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await chatService.deleteChat(id);
    const response = Result.success(null, 204);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error);
  }
};
