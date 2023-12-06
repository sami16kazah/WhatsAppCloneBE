import { log } from 'winston';
import app from './app.js';
import logger from './configs/logger.js';
const PORT = process.env.PORT;
let server;
server = app.listen(PORT, () => {
  logger.info(`server is running at port ${PORT}`);
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
