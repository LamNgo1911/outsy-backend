import express from 'express';
import {
  addUserToChat,
  removeUserFromChat,
  getUsersInChat,
  getChatsByUser,
} from '../controllers/userChatController';

const router = express.Router();

// Add a user to a chat
router.post('/userchat/add', addUserToChat);

// Remove a user from a chat
router.post('/userchat/remove', removeUserFromChat);

// Get all users in a chat
router.get('/userchat/:chatId/users', getUsersInChat);

// Get all chats of a user
router.get('/userchat/:userId/chats', getChatsByUser);

export default router;
