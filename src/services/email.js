import nodemailer from 'nodemailer';

import { getEnvVar } from '../utils/getEnvVar.js';

export const sendResetPasswordEmail = async (email, token) => {
  console.log('sending..');
  const transporter = nodemailer.createTransport({
    host: getEnvVar('SMTP_HOST'),
    port: Number(getEnvVar('SMTP_PORT')),
    secure: getEnvVar('SMTP_PORT') === '465',
    auth: {
      user: getEnvVar('SMTP_USER'),
      pass: getEnvVar('SMTP_PASSWORD'),
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const resetUrl = `${getEnvVar('APP_DOMAIN')}/reset-pwd?token=${token}`;

  try {
    await transporter.sendMail({
      from: getEnvVar('SMTP_FROM'),
      to: email,
      subject: 'Reset Your Password',
      html: `
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 5 minutes.</p>
      `,
    });
  } catch (error) {
    console.log(error);
    throw new Error('Failed to send email');
  }
};
