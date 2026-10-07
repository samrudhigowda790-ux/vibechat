import express from 'express';
import {
  getConversations,
  createConversation,
  getConversationById,
  getConversationInsights,
} from '../controllers/conversationController.js';
import {
  getMessages,
  sendMessage,
} from '../controllers/messageController.js';

const router = express.Router();

// Conversations
router.get('/', getConversations);
router.post('/', createConversation);
router.get('/:id', getConversationById);
router.get('/:id/insights', getConversationInsights);

// Messages inside a conversation
router.get('/:conversationId/messages', getMessages);
router.post('/:conversationId/messages', sendMessage);

export default router;
