import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new chat
export const createChat = async (req: Request, res: Response) => {
  const { userIds } = req.body;
  try {
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
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create chat' });
  }
};

// Delete a chat
export const deleteChat = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  try {
    const chat = await prisma.chat.delete({
      where: { id: chatId },
      include: { users: true, messages: true },
    });
    res.status(204).json(chat);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete chat' });
  }
};

// Get all chats
export const getAllChats = async (req: Request, res: Response) => {
  try {
    const chats = await prisma.chat.findMany({
      include: { users: true, messages: true },
    });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
};

// Get a specific chat
export const getChatById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const chat = await prisma.chat.findUnique({
      where: { id },
      include: { users: true, messages: true },
    });
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat' });
  }
};
