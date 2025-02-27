import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const sendMessage = async (req: Request, res: Response) => {
  const { chatId, senderId, content } = req.body;
  try {
    const message = await prisma.message.create({
      data: {
        chatId,
        senderId,
        content,
      },
      include: { chat: true },
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};

export const getMessagesByChat = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  try {
    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { sentAt: 'asc' },
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};
