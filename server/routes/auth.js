import express from 'express';
import {
  register,
  login,
  getMe,
  logout
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateUser, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validateUser, handleValidationErrors, register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', logout); 

export default router;