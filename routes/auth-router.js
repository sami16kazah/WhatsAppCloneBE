import express from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
} from '../controllers/auth-controller.js';
import trimRequest from 'trim-request';
const router = express.Router();
router.post('/register', trimRequest.all, register);
router.post('/login', trimRequest.all, login);
router.post('/logout', trimRequest.all, logout);
router.post('/refreshToken', trimRequest.all, refreshToken);

export default router;
