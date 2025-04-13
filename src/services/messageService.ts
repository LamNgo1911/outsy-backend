import prisma from '../config/prisma';
import { Message } from '@prisma/client';
import { MessageResponse } from '../types/messageTypes';

// Send a message
const sendMessage = async (
  chatId: string,
  senderId: string,
  content: string
): Promise<Message> => {
  const message = await prisma.message.create({
    data: {
      chatId,
      senderId,
      content,
    },
    include: { chat: true },
  });

  if (message) {
    return message;
  }
  throw new Error('Failed to send message');
};

// Mark messages as read
const markMessagesAsRead = async (
  chatId: string,
  userId: string
): Promise<void> => {
  await prisma.message.updateMany({
    // isRead will be set to true only for all messages sent by other users
    where: { chatId, senderId: { not: userId }, isRead: false },
    data: { isRead: true },
  });
};

// Get messages by chat
const getMessagesByChat = async (chatId: string): Promise<MessageResponse> => {
  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where: { chatId },
      orderBy: { sentAt: 'desc' },
    }),
    prisma.message.count({
      where: { chatId },
    }),
  ]);

  return { messages, total };
};

export default {
  sendMessage,
  markMessagesAsRead,
  getMessagesByChat,
};
