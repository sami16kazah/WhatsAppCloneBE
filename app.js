import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import createHttpError from 'http-errors';
import router from './routes/router.js';
// to access .env variables
dotenv.config();
const app = express();

if (process.env.NODE_ENV !== 'production') {
  // morgan for logging routes results
  app.use(morgan('dev'));
}
// helmet for secure http requests by setting various http headers
app.use(helmet());
// client send data as json
app.use(express.json());
// client send body form as json
app.use(express.urlencoded({ extended: true }));
// to prevent mongo injection
app.use(mongoSanitize());
//enable cookies
app.use(cookieParser());
// to compress res body
app.use(compression());
// to make uploaded file accessible from req.file
app.use(fileUpload({ useTempFiles: true }));
// protect and restrict who can connect to server
//app.use(cors({ origin: 'http://localhost:3000' }));
app.use(cors());
// http error handling
app.use(async (err, req, res, next) => {
  res.status(err.status || 500);
  res.send({ error: { status: err.status || 500, message: err.message } });
  next();
});
app.use('/api/v1', router);
app.all('*', async () => {
  createHttpError.NotFound('this route does not exist');
});
export default app;
