import prisma from '../config/prisma';
import { Chat } from '@prisma/client';
import { ChatResponse, ChatInput, ChatFilters } from '../types/chatTypes';
import { PaginationParams } from '../types/types';

// Create a new chat
const createChat = async (): Promise<Chat> => {
  const chat = await prisma.chat.create({ data: {} });
  if (chat) {
    return chat;
  }
  throw new Error('Failed to create chat');
};

// Update a chat
const updateChat = async (id: string, data: ChatInput): Promise<Chat> => {
  const chat = await prisma.chat.update({
    where: { id },
    data,
    // include: { users: true, messages: true },
  });
  if (chat) {
    return chat;
  }
  throw new Error('Failed to update chat');
};

// Delete a chat
const deleteChat = async (id: string): Promise<void> => {
  await prisma.chat.delete({
    where: { id },
    // include: { users: true, messages: true },
  });
};

// Get all chats with pagination and filtering
const getChats = async (
  filters: ChatFilters = {},
  pagination: PaginationParams = {}
): Promise<ChatResponse> => {
  const { isActive, dateRange } = filters;

  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = pagination;

  const skip = (page - 1) * limit;

  const where = {
    ...(isActive !== undefined && { isActive }),
    ...(dateRange && {
      createdAt: {
        gte: dateRange.start,
        lte: dateRange.end,
      },
    }),
  };

  const [chats, total] = await Promise.all([
    prisma.chat.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    }),
    prisma.chat.count({ where }),
  ]);

  return { chats, total };
};

// Get a specific chat
const getChatById = async (id: string): Promise<Chat> => {
  const chat = await prisma.chat.findUnique({
    where: { id },
    // include: { users: true, messages: true },
  });
  if (chat) {
    return chat;
  }
  throw new Error('Chat not found');
};

export default {
  createChat,
  deleteChat,
  getChats,
  getChatById,
  updateChat,
};
