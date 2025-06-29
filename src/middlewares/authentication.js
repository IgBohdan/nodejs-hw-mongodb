import createError from 'http-errors';
import jwt from 'jsonwebtoken';

import { Session } from '../models/session.js';
import { User } from '../models/user.js';
import { getEnvVar } from '../utils/getEnvVar.js';

const JWT_SECRET = getEnvVar('JWT_SECRET');

export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createError(401, 'Authorization header missing or invalid'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const session = await Session.findOne({ accessToken: token });

    if (!session || session.accessTokenValidUntil < new Date()) {
      return next(createError(401, 'Access token expired or invalid'));
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(createError(401, 'User not found'));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(createError(401, 'Access token expired or invalid'));
  }
}
