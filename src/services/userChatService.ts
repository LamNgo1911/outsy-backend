import { UserChat } from '@prisma/client';
import prisma from '../config/prisma';
import { PaginationParams } from '../types/types';
import {
  UserChatFilters,
  UserChatInput,
  UserChatResponse,
} from '../types/userChatTypes';

// Add a user to a chat
const addUserToChat = async (input: UserChatInput): Promise<UserChat> => {
  // Check if the user and chat exist
  const user = await prisma.user.findUnique({ where: { id: input.userId } });
  const chat = await prisma.chat.findUnique({ where: { id: input.chatId } });

  if (!user || !chat) {
    throw new Error('User or Chat not found');
  }

  // Check if the user is already in the chat
  const existingUserChat = await prisma.userChat.findUnique({
    where: {
      userId_chatId: {
        userId: input.userId,
        chatId: input.chatId,
      },
    },
  });

  // If the user is already in the chat, throw an error
  if (existingUserChat) {
    throw new Error('User is already in the chat');
  }

  // Otherwise, create the UserChat record
  const userChat = await prisma.userChat.create({
    data: {
      userId: input.userId,
      chatId: input.chatId,
    },
  });

  if (userChat) {
    return userChat;
  }
  throw new Error('Failed to add user to chat');
};

// Remove a user from a chat
const removeUserFromChat = async (input: UserChatInput): Promise<void> => {
  // Check if the UserChat record exists
  const userChat = await prisma.userChat.findUnique({
    where: {
      userId_chatId: {
        userId: input.userId,
        chatId: input.chatId,
      },
    },
  });

  if (!userChat) {
    throw new Error('User is not in the chat');
  }

  // Delete the UserChat record
  await prisma.userChat.delete({
    where: {
      userId_chatId: {
        userId: input.userId,
        chatId: input.chatId,
      },
    },
  });
};

// Get all users in a chat with pagination and filtering
const getUsersByChatId = async (
  chatId: string,
  filters: UserChatFilters = {},
  pagination: PaginationParams = {}
): Promise<UserChatResponse> => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = pagination;
  const { dateRange } = filters;

  const skip = (page - 1) * limit;

  const where = {
    chatId,
    ...(dateRange && {
      createdAt: {
        gte: dateRange.start,
        lte: dateRange.end,
      },
    }),
  };

  const [userChats, total] = await Promise.all([
    prisma.userChat.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: { user: true },
    }),
    prisma.userChat.count({ where }),
  ]);

  return {
    users: userChats.map((userChat) => userChat.user),
    total,
  };
};

// Get all chats for a user with pagination and filtering
const getChatsByUserId = async (
  userId: string,
  filters: UserChatFilters = {},
  pagination: PaginationParams = {}
): Promise<UserChatResponse> => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = pagination;
  const { dateRange } = filters;

  const skip = (page - 1) * limit;

  const where = {
    userId,
    ...(dateRange && {
      createdAt: {
        gte: dateRange.start,
        lte: dateRange.end,
      },
    }),
  };

  const [userChats, total] = await Promise.all([
    prisma.userChat.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: { chat: true },
    }),
    prisma.userChat.count({ where }),
  ]);

  return {
    chats: userChats.map((userChat) => userChat.chat),
    total,
  };
};

export default {
  addUserToChat,
  removeUserFromChat,
  getUsersByChatId,
  getChatsByUserId,
};
