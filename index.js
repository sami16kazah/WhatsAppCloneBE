import app from './app.js';
import logger from './configs/logger.js';
const PORT = process.env.PORT;

app.listen(PORT, () => {
  logger.info(`server is running at port ${PORT}`);
});
