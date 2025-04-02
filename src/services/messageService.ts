import prisma from '../config/prisma';
import { Message } from '@prisma/client';

// Add a new message
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

  return message;
};

// Mark messages as read
const markMessagesAsRead = async (
  chatId: string,
  userId: string
): Promise<void> => {
  await prisma.message.updateMany({
    // isRead will be set to true only for messages sent by other users
    where: { chatId, senderId: { not: userId }, isRead: false },
    data: { isRead: true },
  });
};

// Get messages by chat
const getMessagesByChat = async (chatId: string): Promise<Message[]> => {
  const messages = await prisma.message.findMany({
    where: { chatId },
    orderBy: { sentAt: 'asc' },
  });
  return messages;
};

export default { sendMessage, markMessagesAsRead, getMessagesByChat };
