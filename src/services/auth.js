import bcrypt from 'bcrypt';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';

import { Session } from '../models/session.js';
import { User } from '../models/user.js';
import { getEnvVar } from '../utils/getEnvVar.js';

const JWT_SECRET = getEnvVar('JWT_SECRET');

export async function registerUser({ name, email, password }) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return {
    name: user.name,
    email: user.email,
    _id: user._id,
  };
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(401, 'Email or password is incorrect');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createError(401, 'Email or password is incorrect');
  }

  await Session.deleteMany({ userId: user._id });

  const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: '30d',
  });

  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken, userId: user._id };
}

export async function refreshSession(refreshToken) {
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, JWT_SECRET);
  } catch (err) {
    throw createError(401, 'Invalid refresh token');
  }

  const session = await Session.findOne({ refreshToken });
  if (!session || session.refreshTokenValidUntil < new Date()) {
    throw createError(401, 'Refresh token expired or invalid');
  }

  await Session.deleteOne({ refreshToken });

  const newAccessToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, {
    expiresIn: '15m',
  });
  const newRefreshToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, {
    expiresIn: '30d',
  });

  const newSession = await Session.create({
    userId: decoded.userId,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export async function logoutUser(refreshToken) {
  await Session.deleteOne({ refreshToken });
}
