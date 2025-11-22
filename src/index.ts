import { Request, Response, NextFunction } from 'express'
import http from 'http';
import express from 'express'
import Logging from './config/logging'
import {PORT} from './config/config';
import loader from './loaders';
import client from 'prom-client';

// Initialize Prometheus metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const exitHandler = (server: http.Server | null) => {
  if (server) {
    server.close(() => {
      Logging.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unExpectedErrorHandler = (server: http.Server | null) => {
  return function (error: Error) {
    Logging.error(error);
    exitHandler(server);
  };
};

const startServer = async (): Promise<void> => {

    const app = express();
    await loader(app);

    // Prometheus metrics endpoint
    app.get('/metrics', async (req: Request, res: Response) => {
      res.set('Content-Type', client.register.contentType);
      res.end(await client.register.metrics());
    });

    const httpServer = http.createServer(app);
    const server = httpServer.listen(PORT, () => {
      Logging.info(`Server listening on port ${PORT}`);
    });
    process.on('uncaughtException', unExpectedErrorHandler(server));
    process.on('unhandledRejection', unExpectedErrorHandler(server));
    process.on('SIGTERM', () => {
      Logging.info('SIGTERM received');
      if (server) {
        server.close();
      }
    });
};

startServer();