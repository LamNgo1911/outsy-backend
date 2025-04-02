import { Request, Response } from 'express';
import UserChatService from '../services/userChatService';

// Add a user to a chat
export const addUserToChat = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, chatId } = req.body;
    await UserChatService.addUserToChat(userId, chatId);
    res.status(200).json({ message: 'User added to chat' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding user to chat' });
  }
};

// Remove a user from a chat
export const removeUserFromChat = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, chatId } = req.body;
    await UserChatService.removeUserFromChat(userId, chatId);
    res.status(200).json({ message: 'User removed from chat' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing user from chat' });
  }
};

// Get all users in a chat
export const getUsersByChat = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { chatId } = req.params;
    const users = await UserChatService.getUsersByChat(chatId);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users in chat' });
  }
};

// Get all chats for a user
export const getChatsByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const chats = await UserChatService.getChatsByUser(userId);
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chats for user' });
  }
};
