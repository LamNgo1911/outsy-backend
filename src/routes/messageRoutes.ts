import { Router } from 'express';
import {
  sendMessage,
  getMessagesByChat,
  markMessagesAsRead,
} from '../controllers/messageController';

const router = Router();

// NOTE: Authentication middleware should be applied here
// router.use(authenticateUser); // Ensure only authenticated users can send messages

router.post('/', sendMessage);
router.put('/', markMessagesAsRead);
router.get('/:chatId', getMessagesByChat);

export default router;
