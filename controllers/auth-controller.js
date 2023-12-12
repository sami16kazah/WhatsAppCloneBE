import createHttpError from 'http-errors';
import { createUser, signUser } from '../services/auth.service.js';
import { generateToken, verifyToken } from '../services/token.service.js';
import { findUser } from '../services/user.service.js';
export const register = async (req, res, next) => {
  try {
    const { name, email, picture, status, password } = req.body;
    const newUser = await createUser({
      name,
      email,
      picture,
      status,
      password,
    });
    const accessToken = await generateToken(
      { userId: newUser._id },
      '1d',
      process.env.ACCESS_TOKEN_SECRET
    );

    const refreshToken = await generateToken(
      { userId: newUser._id },
      '30d',
      process.env.REFRESH_TOKEN_SECRET
    );
    req.session = { refreshToken: refreshToken };
    //console.table({ accessToken, refreshToken });

    res.json({
      msg: 'register success',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        picture: newUser.picture,
        status: newUser.status,
        token: accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await signUser(email, password);
    const accessToken = await generateToken(
      { userId: user._id },
      '1d',
      process.env.ACCESS_TOKEN_SECRET
    );

    const refreshToken = await generateToken(
      { userId: user._id },
      '30d',
      process.env.REFRESH_TOKEN_SECRET
    );
    req.session = { refreshToken: refreshToken };
    //console.table({ accessToken, refreshToken });
    res.json({
      msg: 'logged in success',

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        status: user.status,
        token: accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    req.session = null;
    res.json({ message: ' logged out !' });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.session;
    if (!refreshToken) {
      throw createHttpError.Unauthorized('please login first');
    }
    const check = await verifyToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await findUser(check.userId);
    const accessToken = await generateToken(
      { userId: user._id },
      '1d',
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        status: user.status,
        token: accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
