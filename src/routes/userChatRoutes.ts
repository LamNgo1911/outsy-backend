import express from 'express';
import {
  addUserToChat,
  removeUserFromChat,
  getUsersInChat,
  getChatsByUser,
} from '../controllers/userChatController';

const router = express.Router();

// Add a user to a chat
router.post('/', addUserToChat);

// Remove a user from a chat
router.post('/:chatId/:userId', removeUserFromChat);

// Get all users in a chat
router.get('/:chatId/users', getUsersInChat);

// Get all chats of a user
router.get('/:userId/chats', getChatsByUser);

export default router;
