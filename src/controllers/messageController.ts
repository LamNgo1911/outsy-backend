import { Request, Response } from 'express';
import messageService from '../services/messageService';

export const sendMessage = async (req: Request, res: Response) => {
  const { chatId, senderId, content } = req.body;
  try {
    const message = await messageService.sendMessage(chatId, senderId, content);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};

export const getMessagesByChat = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  try {
    const messages = await messageService.getMessagesByChat(chatId);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};
