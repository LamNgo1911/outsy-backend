import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const sendMessage = async (chatId: string, senderId: string, content: string) => {
  return await prisma.message.create({
    data: {
      chatId,
      senderId,
      content,
    },
    include: { chat: true },
  });
};

export const getMessagesByChat = async (chatId: string) => {
  return await prisma.message.findMany({
    where: { chatId },
    orderBy: { sentAt: 'asc' },
  });
};
