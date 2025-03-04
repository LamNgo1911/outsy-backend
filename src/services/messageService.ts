import prisma from '../config/prisma';
import { Message } from '@prisma/client';

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

const getMessagesByChat = async (chatId: string): Promise<Message[]> => {
  const messages = await prisma.message.findMany({
    where: { chatId },
    orderBy: { sentAt: 'asc' },
  });
  return messages;
};

export default { sendMessage, getMessagesByChat };
