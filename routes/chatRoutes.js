import express from 'express';
import chatController from '../controllers/chatController.js';
import { protect } from '../config/authMiddleware.js';

const router = express.Router();

router.get('/:roomName', protect, chatController.getRoomHistory);

export default router;