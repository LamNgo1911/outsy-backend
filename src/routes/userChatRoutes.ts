import express from 'express';
import {
  addUserToChat,
  removeUserFromChat,
  getUsersByChatId,
  getChatsByUserId,
} from '../controllers/userChatController';

const router = express.Router();

// Add a user to a chat
router.post('/', addUserToChat);

// Remove a user from a chat
router.delete('/', removeUserFromChat);

// Get all users in a chat
router.get('/:chatId/users', getUsersByChatId);

// Get all chats of a user
router.get('/:userId/chats', getChatsByUserId);

export default router;
