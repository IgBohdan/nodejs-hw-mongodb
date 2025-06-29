import mongoose from 'mongoose';

import { getEnvVar } from '../utils/getEnvVar.js';

export async function initMongoConnection() {
  try {
    const MONGODB_USER = getEnvVar('MONGODB_USER');
    const MONGODB_PASSWORD = getEnvVar('MONGODB_PASSWORD');
    const MONGODB_URL = getEnvVar('MONGODB_URL');
    const MONGODB_DB = getEnvVar('MONGODB_DB');

    const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;
    console.log(uri);
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Mongo connection error:', error);
    process.exit(1);
  }
}
