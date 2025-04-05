import { Router } from 'express';
import {
  createChat,
  deleteChat,
  getAllChats,
  getChatById,
  updateChat,
} from '../controllers/chatController';
import { validateRequest } from '../middlewares/validateRequest';
import { authMiddleware } from '../middlewares/authMiddleware';
import { z } from 'zod';

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

// Pagination and filtering schema for GET routes
const chatQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : 10)),
    sortBy: z.enum(['createdAt', 'isActive']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    isActive: z
      .string()
      .optional()
      .transform((val) => val === 'true'),
  }),
});

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Create chat
router.post('/', createChat);

// Get all chats with pagination and filtering
router.get('/', validateRequest(chatQuerySchema), getAllChats);

// Get chat by ID
router.get('/:id', validateRequest(chatIdSchema), getChatById);

// Update chat
router.put('/:id', validateRequest(chatUpdateSchema), updateChat);

// Delete chat
router.delete('/:id', validateRequest(chatIdSchema), deleteChat);

export default router;
