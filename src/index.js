const mongoose = require('mongoose');
const app = require('./app');
const redisClient = require('./configs/cache');
const config = require('./configs/config');
const logger = require('./configs/logger');

let server;

const startSever = async () => {
  await mongoose.connect(config.mongoose.url, config.mongoose.options);
  logger.info('Connected to MongoDB');
  await redisClient.connect();
  logger.info('Connected to Redis');
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
};

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});

startSever();