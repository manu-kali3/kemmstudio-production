import { dbReady } from '../config/db.js';
import { memory } from './memory.js';
import { pgStore } from './pgStore.js';

function delegate(name) {
  const methods = ['create','insertMany','find','findOne','findById','findByIdAndUpdate','findByIdAndDelete','deleteMany','updateMany','updateOne','countDocuments'];
  const obj = {};
  for (const m of methods) {
    obj[m] = (...args) => {
      const store = dbReady ? pgStore : memory;
      return store[name][m](...args);
    };
  }
  return obj;
}

export const User = delegate('users');
export const Session = delegate('sessions');
export const VerificationCode = delegate('verificationCodes');
export const TokenBlacklist = delegate('tokenBlacklist');
export const PortfolioItem = delegate('portfolio');
export const Booking = delegate('bookings');
export const Message = delegate('messages');
