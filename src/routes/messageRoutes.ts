import { Router } from 'express';
import {
  sendMessage,
  getMessagesByChat,
  markMessagesAsRead,
} from '../controllers/messageController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { z } from 'zod';

const router = Router();

// Validation schemas
const sendMessageSchema = z.object({
  body: z.object({
    chatId: z.string().min(1, 'Chat ID is required'),
    senderId: z.string().min(1, 'Sender ID is required'),
    content: z.string().min(1, 'Message content is required'),
  }),
});

const markMessagesAsReadSchema = z.object({
  body: z.object({
    chatId: z.string().min(1, 'Chat ID is required'),
    userId: z.string().min(1, 'User ID is required'),
  }),
});

const chatIdSchema = z.object({
  params: z.object({
    chatId: z.string().min(1, 'Chat ID is required'),
  }),
});

// Apply authentication middleware to all routes
router.use(authMiddleware);

// 
router.post('/', validateRequest(sendMessageSchema), sendMessage);
router.put('/', validateRequest(markMessagesAsReadSchema), markMessagesAsRead);
router.get('/:chatId', validateRequest(chatIdSchema), getMessagesByChat);

export default router;
