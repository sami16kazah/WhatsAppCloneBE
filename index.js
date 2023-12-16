import app from './app.js';
import logger from './configs/logger.js';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import SocketServer from './SocketServer.js';
const { MONGODB_URI } = process.env;
const PORT = process.env.PORT;
// exit on mongodb error
mongoose.connection.on('error', (err) => {
  logger.error(`MongoDb Connection Error : ${err}`);
  process.exit(1);
});
//mongo db debug mode
if (process.env.NODE_ENV !== 'production') {
  mongoose.set('debug', true);
}
mongoose.connect(MONGODB_URI).then(logger.info('connected to mongo'));
let server;
server = app.listen(PORT, () => {
  logger.info(`server is running at port ${PORT}`);
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CLIENT_END_POINT,
  },
});
io.on('connection', (socket) => {
  logger.info('socket io connected successfully');
  SocketServer(socket, io);
});

//handle server error
const exitHandler = () => {
  if (server) {
    logger.info('serverClosed');
    process.exit(1);
  } else {
    process.exit(1);
  }
};

const unexprectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexprectedErrorHandler);
process.on('unhandledRejection', unexprectedErrorHandler);

process.on('SIGTERM', () => {
  if (server) {
    logger.info('serverClosed');
    process.exit(1);
  }
});
