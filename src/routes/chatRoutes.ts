import { Router } from 'express';
import {
  createChat,
  deleteChat,
  getChatById,
  getChats,
  updateChat,
} from '../controllers/chatController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import {
  chatIdSchema,
  chatQuerySchema,
  chatUpdateSchema,
} from '../utils/validation/chatSchema';

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Create chat
router.post('/', createChat);

// Get all chats with pagination and filtering
router.get('/', validateRequest(chatQuerySchema), getChats);

// Get chat by ID
router.get('/:id', validateRequest(chatIdSchema), getChatById);

// Update chat
router.put('/:id', validateRequest(chatUpdateSchema), updateChat);

// Delete chat
router.delete('/:id', validateRequest(chatIdSchema), deleteChat);

export default router;
