import { Router } from 'express';
import { createBooking, listBookings, updateBooking, deleteBooking, createMessage, listMessages, updateMessage, deleteMessage } from '../controllers/bookingController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { rateLimit } from '../middleware/rateLimiters.js';

const router = Router();

// booking/contact form endpoints (strict limits)
router.post('/bookings', rateLimit('contact', { byEmail: true }), createBooking);
router.post('/messages', rateLimit('contact', { byEmail: true }), createMessage);

// admin management
router.get('/bookings', requireAuth, requireAdmin, listBookings);
router.patch('/bookings/:id', requireAuth, requireAdmin, updateBooking);
router.delete('/bookings/:id', requireAuth, requireAdmin, deleteBooking);
router.get('/messages', requireAuth, requireAdmin, listMessages);
router.patch('/messages/:id', requireAuth, requireAdmin, updateMessage);
router.delete('/messages/:id', requireAuth, requireAdmin, deleteMessage);

export default router;
