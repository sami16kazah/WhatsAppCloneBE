import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
export default async function (req, res, next) {
  if (!req.session || !req.session.refreshToken) {
    return next(createHttpError.Unauthorized('you are not logged in'));
  }
  const token = req.session.refreshToken;

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (error, payload) => {
    if (error) {
      return next(createHttpError.Unauthorized('invalid token'));
    } else {
      req.user = payload;
      next();
    }
  });
}
