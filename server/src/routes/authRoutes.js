import { Router } from 'express';
import { register, login, verifyTwoFactor, resendCode, refresh, logout, heartbeat, me, forgotPassword, resetPassword } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema, verifySchema, resendSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/authValidators.js';
import { rateLimit } from '../middleware/rateLimiters.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register', rateLimit('register', { byEmail: true }), validate(registerSchema), register);
router.post('/login', rateLimit('login', { byEmail: true }), validate(loginSchema), login);
router.post('/verify-2fa', rateLimit('verify', { byEmail: false }), validate(verifySchema), verifyTwoFactor);
router.post('/resend-code', rateLimit('resend', { byEmail: false }), validate(resendSchema), resendCode);
router.post('/forgot-password', rateLimit('passwordReset', { byEmail: true }), validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', rateLimit('passwordReset', { byEmail: true }), validate(resetPasswordSchema), resetPassword);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/heartbeat', heartbeat);
router.get('/me', requireAuth, me);

export default router;
