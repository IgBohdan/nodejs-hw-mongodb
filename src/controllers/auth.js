import createError from 'http-errors';

import { loginUser, logoutUser, refreshSession, registerUser, resetPassword, sendResetEmail } from '../services/auth.js';

export async function registerController(req, res) {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
}

export async function loginController(req, res) {
  const { accessToken, refreshToken } = await loginUser(req.body);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken },
  });
}

export async function refreshController(req, res) {
  console.log('cookies', req.cookies);
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw createError(401, 'Refresh token not provided');
  }

  const { accessToken, refreshToken: newRefreshToken } = await refreshSession(
    refreshToken
  );

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken },
  });
}

export async function logoutController(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw createError(401, 'Refresh token not provided');
  }

  await logoutUser(refreshToken);
  res.clearCookie('refreshToken');
  res.status(204).send();
}
export async function sendResetEmailController(req, res) {
  await sendResetEmail(req.body.email);

  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
}

export async function resetPasswordController(req, res) {
  const { token, password } = req.body;
  await resetPassword(token, password);

  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
}
