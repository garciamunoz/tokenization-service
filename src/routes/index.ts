import express from 'express';
import TokenController from '../controllers/TokenController';

const router = express.Router();

router.post('/tokenize', TokenController.tokenizeCard);
router.get('/card/:token', TokenController.getCardData);

export default router;
