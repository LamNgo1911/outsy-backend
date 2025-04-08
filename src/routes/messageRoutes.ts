import { Router } from 'express';
import {
  getMessagesByChat,
  markMessagesAsRead,
  sendMessage,
} from '../controllers/messageController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import {
  chatIdSchema,
  markMessagesAsReadSchema,
  sendMessageSchema,
} from '../utils/validation/messageSchema';

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

router.post('/', validateRequest(sendMessageSchema), sendMessage);
router.put('/', validateRequest(markMessagesAsReadSchema), markMessagesAsRead);
router.get('/:chatId', validateRequest(chatIdSchema), getMessagesByChat);

export default router;
