import cors from 'cors';
import express from 'express';
import pino from 'pino';
import pinoHttp from 'pino-http';

import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { contactsRouter } from './routers/contacts.js';
import { getEnvVar } from './utils/getEnvVar.js';

export function setupServer() {
  const app = express();
  const logger = pino();

  app.use(cors());
  app.use(express.json());
  app.use(pinoHttp({ logger }));

  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = Number(getEnvVar('PORT', '4000'));
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  return app;
}
