import { Router } from "express";
import { sendMessage, getMessagesByChat } from '../controllers/messageController';

const router = Router();

// NOTE: Authentication middleware should be applied here
// router.use(authenticateUser); // Ensure only authenticated users can send messages

router.post('/chats/:chatId/messages', sendMessage);
router.get('/chats/:chatId/messages', getMessagesByChat);

export default router;