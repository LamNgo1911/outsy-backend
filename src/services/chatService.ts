import prisma from '../config/prisma';
import { Chat } from '@prisma/client';

// Create a new chat
const createChat = async (userIds: string[]): Promise<Chat> => {
  const chat = await prisma.chat.create({
    data: {
      users: {
        create: userIds.map((userId: string) => ({
          /* NOTE: 
              For each user ID, this object tells Prisma to create a new record in the UserChat join table 
              & connect this relationship to an existing user whose id matches the given userId
              */
          user: { connect: { id: userId } },
        })),
      },
    },
    include: { users: true, messages: true },
  });
  if (chat) {
    return chat;
  }
  throw new Error('Failed to create chat');
};

// Delete a chat
const deleteChat = async (id: string): Promise<Chat> => {
  const chat = await prisma.chat.delete({
    where: { id },
    include: { users: true, messages: true },
  });
  if (chat) {
    return chat;
  }
  throw new Error('Failed to delete chat');
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

export default { createChat, deleteChat, getAllChats, getChatById };
