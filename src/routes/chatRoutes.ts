import { Router } from "express";
import {
  createChat,
  deleteChat,
  getAllChats,
  getChatById,
} from '../controllers/chatController'; 

const router = Router();

router.post('/chats', createChat);

router.delete('/chats/:id', deleteChat);

router.get('/chats', getAllChats);

router.get('/chats/:id', getChatById);

export default router;