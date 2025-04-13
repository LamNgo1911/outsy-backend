import { Request, Response } from 'express';
import messageService from '../services/messageService';
import { MessageInput } from '../types/messageTypes';
import { Result } from '../utils/Result';

// Send a message
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const messageData: MessageInput = req.body;
    const message = await messageService.sendMessage(
      messageData.chatId,
      messageData.senderId,
      messageData.content
    );
    const response = Result.success(message, 201);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Mark messages as read
export const markMessagesAsRead = async (req: Request, res: Response) => {
  const { chatId, userId } = req.body;
  try {
    await messageService.markMessagesAsRead(chatId, userId);
    const response = Result.success(null, 200);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
};

// Get messages by chat
export const getMessagesByChat = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  try {
    const result = await messageService.getMessagesByChat(chatId);
    const response = Result.success(result);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};
