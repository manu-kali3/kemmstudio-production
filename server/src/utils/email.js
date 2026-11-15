import { Resend } from 'resend';
import { env } from '../config/env.js';

let resend;
function getResend() {
  if (!resend) resend = new Resend(env.resendApiKey);
  return resend;
}

export async function sendVerificationCodeEmail(to, code) {
  const client = getResend();
  const { error } = await client.emails.send({
    from: env.emailFrom,
    to,
    subject: 'Your Kemmstudio Production verification code',
    html: `<div style="font-family:Arial,sans-serif"><h2>Verification code</h2><p>Your login verification code is:</p><p style="font-size:28px;font-weight:bold;letter-spacing:4px">${code}</p><p>This code expires in 5 minutes. If you did not request this, you can ignore this email.</p></div>`,
  });
  if (error) throw new Error(error.message || 'Failed to send verification email');
}
