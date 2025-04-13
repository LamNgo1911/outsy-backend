import { Request, Response, NextFunction } from 'express';
import userChatService from '../services/userChatService';
import { Result } from '../utils/Result';
import { UserChatFilters, UserChatInput } from '../types/userChatTypes';

// Add a user to a chat
export const addUserToChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const input: UserChatInput = {
      userId: req.body.userId,
      chatId: req.body.chatId,
    };
    const userChat = await userChatService.addUserToChat(input);
    res.status(201).json(Result.success(userChat));
  } catch (error) {
    next(error);
  }
};

// Remove a user from a chat
export const removeUserFromChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const input: UserChatInput = {
      userId: req.body.userId,
      chatId: req.body.chatId,
    };
    await userChatService.removeUserFromChat(input);
    res.status(200).json(Result.success(null));
  } catch (error) {
    next(error);
  }
};

// Get all users in a chat with pagination and filtering
export const getUsersByChatId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId } = req.params;
    const { page, limit, sortBy, sortOrder } = req.query;
    const { start, end } = req.query;

    const filters: UserChatFilters = {};
    if (start && end) {
      filters.dateRange = {
        start: new Date(start as string),
        end: new Date(end as string),
      };
    }

    const pagination = {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
    };

    const result = await userChatService.getUsersByChatId(
      chatId,
      filters,
      pagination
    );
    res.status(200).json(Result.success(result));
  } catch (error) {
    next(error);
  }
};

// Get all chats for a user with pagination and filtering
export const getChatsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { page, limit, sortBy, sortOrder } = req.query;
    const { start, end } = req.query;

    const filters: UserChatFilters = {};
    if (start && end) {
      filters.dateRange = {
        start: new Date(start as string),
        end: new Date(end as string),
      };
    }

    const pagination = {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
    };

    const result = await userChatService.getChatsByUserId(
      userId,
      filters,
      pagination
    );
    res.status(200).json(Result.success(result));
  } catch (error) {
    next(error);
  }
};
