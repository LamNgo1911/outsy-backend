import prisma from '../config/prisma';
import { Chat } from '@prisma/client';

// Create a new chat
const createChat = async (): Promise<Chat> => {
  const chat = await prisma.chat.create({ data: {} });
  if (chat) {
    return chat;
  }
  throw new Error('Failed to create chat');
};

// Update a chat
const updateChat = async (id: string, data: Partial<Chat>): Promise<Chat> => {
  const chat = await prisma.chat.update({
    where: { id },
    data,
    include: { users: true, messages: true },
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
    include: { users: true, messages: true },
  });
};

// Get all chats
const getAllChats = async (): Promise<Chat[]> => {
  const chats = await prisma.chat.findMany({
    include: { users: true, messages: true },
  });
  if (chats) {
    return chats;
  }
  throw new Error('Failed to fetch chats');
};

// Get a specific chat
const getChatById = async (id: string): Promise<Chat | null> => {
  const chat = await prisma.chat.findUnique({
    where: { id },
    include: { users: true, messages: true },
  });
  if (chat) {
    return chat;
  }
  throw new Error('Failed to fetch chat');
};

export default { createChat, deleteChat, getAllChats, getChatById, updateChat };
