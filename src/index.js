import dotenv from 'dotenv';
import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

dotenv.config();

async function start() {
  await initMongoConnection();
  setupServer();
}

start();
