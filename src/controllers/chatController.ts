import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import chatService from '../services/chatService';

const prisma = new PrismaClient();

// Create a new chat
export const createChat = async (req: Request, res: Response) => {
  const { userIds } = req.body;
  try {
    const chat = await chatService.createChat(userIds);
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create chat' });
  }
};

// Delete a chat
export const deleteChat = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const chat = await chatService.deleteChat(id);
    res.status(204).json(chat);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete chat' });
  }
};

// Get all chats
export const getAllChats = async (req: Request, res: Response) => {
  try {
    const chats = await chatService.getAllChats();
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
};

// Get a specific chat
export const getChatById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const chat = await chatService.getChatById(id);
    res.json(chat);
  } catch (error) {
    res.status(404).json({ error: 'Failed to fetch chat' });
  }
};
