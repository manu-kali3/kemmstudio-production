import Booking from '../models/Booking.js';
import Message from '../models/Message.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.create(req.body);
  res.status(201).json({ message: 'Booking request received', booking });
});

export const listBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find().sort({ createdAt: -1 });
  res.json({ bookings });
});

export const updateBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!booking) return res.status(404).json({ message: 'Not found' });
  res.json({ booking });
});

export const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

export const createMessage = asyncHandler(async (req, res) => {
  const message = await Message.create(req.body);
  res.status(201).json({ message: 'Message received', data: message });
});

export const listMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.json({ messages });
});

export const updateMessage = asyncHandler(async (req, res) => {
  const msg = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!msg) return res.status(404).json({ message: 'Not found' });
  res.json({ message: msg });
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const msg = await Message.findByIdAndDelete(req.params.id);
  if (!msg) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});
