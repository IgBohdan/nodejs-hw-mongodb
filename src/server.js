import cors from 'cors';
import express from 'express';
import pino from 'pino';
import pinoHttp from 'pino-http';
import {
  getContactByIdController,
  getContacts,
} from './controllers/contacts.js';
import { getEnvVar } from './utils/getEnvVar.js';

export function setupServer() {
  const app = express();
  const logger = pino();

  app.use(cors());
  app.use(pinoHttp({ logger }));

  app.get('/contacts', getContacts);
  app.get('/contacts/:contactId', getContactByIdController);

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const PORT = Number(getEnvVar('PORT', '4000'));
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  return app;
}
