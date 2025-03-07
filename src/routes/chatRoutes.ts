import { Router } from 'express';
import {
  createChat,
  deleteChat,
  getAllChats,
  getChatById,
} from '../controllers/chatController';

const router = Router();

router.post('/', createChat);

router.delete('/:chatId', deleteChat);

router.get('/', getAllChats);

router.get('/:chatId', getChatById);

export default router;
