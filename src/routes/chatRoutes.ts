import { Router } from 'express';
import { z } from 'zod';
import {
  createChat,
  deleteChat,
  getChats,
  getChatById,
  updateChat
} from '../controllers/chatController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';

const router = Router();

// Validation schemas
const chatIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Chat ID is required'),
  }),
});

const chatUpdateSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Chat ID is required'),
  }),
  body: z.object({
    isActive: z.boolean().optional(),
  }),
});

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Create chat
router.post('/', createChat);

// Get all chats with pagination and filtering
router.get('/', getChats);

// Get chat by ID
router.get('/:id', validateRequest(chatIdSchema), getChatById);

// Update chat
router.put('/:id', validateRequest(chatUpdateSchema), updateChat);

// Delete chat
router.delete('/:id', validateRequest(chatIdSchema), deleteChat);

export default router;
