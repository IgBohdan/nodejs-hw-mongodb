import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import path from 'node:path';
import pino from 'pino';
import pinoHttp from 'pino-http';

import multer from 'multer';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { authRouter } from './routers/auth.js';
import { contactsRouter } from './routers/contacts.js';
import { getEnvVar } from './utils/getEnvVar.js';

const upload = multer({ dest: 'uploads/' });

export function setupServer() {
  const app = express();
  const logger = pino();
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
  app.use(cors());
  app.use(express.json());
  app.use(pinoHttp({ logger }));
  app.use(cookieParser());

  app.use('/contacts', upload.single('photo'), contactsRouter);
  app.use('/auth', authRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = Number(getEnvVar('PORT', '4000'));
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  return app;
}
