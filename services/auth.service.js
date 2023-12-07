import createHttpError from 'http-errors';
import validator from 'validator';
import { UserModel } from '../models/models.js';
export const createUser = async (userdata) => {
  const { name, email, picture, status, password } = userdata;
  const { USER_PICTURE, DEFAULT_STATUS } = process.env;
  // check if emails is empty
  if (!name || !email || !password) {
    throw createHttpError.BadRequest('please fill all fileds .');
  }
  if (!validator.isLength(name, { min: 2, max: 16 })) {
    throw createHttpError.BadRequest(
      'please make sure your name is between 2 and 16 charcaters'
    );
  }

  if (status && status.length > 64) {
    throw createHttpError.BadRequest(
      'please make sure your status is less than 64 charcaters'
    );
  }

  if (!validator.isEmail(email)) {
    throw createHttpError.BadRequest('please enter valid email');
  }

  // check if user already exist
  const checkDb = await UserModel.findOne({ email });
  if (checkDb) {
    throw createHttpError.Conflict('email already exist !');
  }

  if (!validator.isLength(password, { min: 6, max: 20 })) {
    throw createHttpError.BadRequest(
      'please make sure your password is between 2 and 16 charcaters'
    );
  }
  const user = await new UserModel({
    name,
    email,
    picture: picture || USER_PICTURE,
    status: status || DEFAULT_STATUS,
    password,
  }).save();
  return user;
};
