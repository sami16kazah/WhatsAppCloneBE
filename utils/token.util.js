import jwt from 'jsonwebtoken';
import logger from '../configs/logger.js';
export const sign = async (payload, expiresIn, secret) => {
  // jwt is not sync
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, { expiresIn: expiresIn }, (error, token) => {
      if (error) {
        logger.error(error);
        reject(error);
      } else {
        resolve(token);
      }
    });
  });
};
