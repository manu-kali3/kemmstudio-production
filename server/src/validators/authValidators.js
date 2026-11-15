import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    password: z.string().min(8).max(128),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});

export const verifySchema = z.object({
  body: z.object({
    pendingToken: z.string().min(10),
    code: z.string().regex(/^\d{6}$/),
  }),
});

export const resendSchema = z.object({
  body: z.object({
    pendingToken: z.string().min(10),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
    code: z.string().regex(/^\d{6}$/),
    newPassword: z.string().min(8).max(128),
  }),
});
