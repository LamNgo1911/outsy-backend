import express from 'express';
import {
  addUserToChat,
  removeUserFromChat,
  getUsersByChatId,
  getChatsByUserId,
} from '../controllers/userChatController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { z } from 'zod';

const router = express.Router();

// Validation schemas
const userChatSchema = z.object({
  body: z.object({
    userId: z.string().min(1, 'User ID is required'),
    chatId: z.string().min(1, 'Chat ID is required'),
  }),
});

const chatIdSchema = z.object({
  params: z.object({
    chatId: z.string().min(1, 'Chat ID is required'),
  }),
});

const userIdSchema = z.object({
  params: z.object({
    userId: z.string().min(1, 'User ID is required'),
  }),
});

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Add a user to a chat
router.post('/', validateRequest(userChatSchema), addUserToChat);

// Remove a user from a chat
router.delete('/', validateRequest(userChatSchema), removeUserFromChat);

// Get all users in a chat
router.get('/:chatId/users', validateRequest(chatIdSchema), getUsersByChatId);

// Get all chats of a user
router.get('/:userId/chats', validateRequest(userIdSchema), getChatsByUserId);

export default router;
