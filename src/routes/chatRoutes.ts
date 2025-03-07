import { Router } from 'express';
import {
  createChat,
  deleteChat,
  getAllChats,
  getChatById,
} from '../controllers/chatController';

const router = Router();

router.post('/', createChat);

router.delete('/:id', deleteChat);

router.get('/', getAllChats);

router.get('/:id', getChatById);

export default router;
