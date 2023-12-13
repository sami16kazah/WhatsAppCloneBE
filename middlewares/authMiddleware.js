import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
export default async function (req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return next(createHttpError.Unauthorized('you are not logged in'));
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, payload) => {
    if (error) {
      return next(createHttpError.Unauthorized('invalid token'));
    } else {
      req.user = payload;
      next();
    }
  });
}
