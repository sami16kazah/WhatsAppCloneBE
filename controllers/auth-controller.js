import { createUser } from '../services/auth.service.js';
import { generateToken } from '../services/token.service.js';

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
      accessToken,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        picture: newUser.picture,
        status: newUser.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = signUser(email, password);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
