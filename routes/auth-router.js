import express from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
} from '../controllers/auth-controller.js';
import trimRequest from 'trim-request';
import authMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();
router.post('/register', trimRequest.all, register);
router.post('/login', trimRequest.all, login);
router.post('/logout', trimRequest.all, authMiddleware, logout);
router.post('/refreshtoken', trimRequest.all, authMiddleware, refreshToken);

export default router;
