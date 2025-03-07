import prisma from '../config/prisma';
import { Chat, User, UserChat } from '@prisma/client';

// Add a user to a chat
const addUserToChat = async (
  userId: string,
  chatId: string
): Promise<UserChat> => {
  // Check if the user and chat exist
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const chat = await prisma.chat.findUnique({ where: { id: chatId } });

  if (!user || !chat) {
    throw new Error('User or Chat not found');
  }

  // Check if the user is already in the chat
  const existingUserChat = await prisma.userChat.findUnique({
    where: {
      userId_chatId: {
        userId,
        chatId,
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
      userId,
      chatId,
    },
  });

  if (userChat) {
    return userChat;
  }
  throw new Error('Failed to add user to chat');
};

// Remove a user from a chat
const removeUserFromChat = async (userId: string, chatId: string) => {
  // Check if the UserChat record exists
  const userChat = await prisma.userChat.findUnique({
    where: {
      userId_chatId: {
        userId,
        chatId,
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
        userId,
        chatId,
      },
    },
  });
};

// Get all users in a chat
const getUsersInChat = async (chatId: string): Promise<User[]> => {
  const userChats = await prisma.userChat.findMany({
    where: { chatId },
    include: { user: true }, // Include user details
  });

  if (userChats) {
    return userChats.map((userChat) => userChat.user);
  }
  throw new Error('Failed to fetch users in chat');
};

// Get all chats for a user
const getChatsByUser = async (userId: string): Promise<Chat[]> => {
  const userChats = await prisma.userChat.findMany({
    where: { userId },
    include: { chat: true }, // Include chat details
  });

  if (userChats) {
    return userChats.map((userChat) => userChat.chat);
  }

  throw new Error('Failed to fetch chats for user');
};

export default {
  addUserToChat,
  removeUserFromChat,
  getUsersInChat,
  getChatsByUser,
};
