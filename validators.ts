import { z } from "zod";

// Auth validators
export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Tip validators
export const tipSchema = z.object({
  tipperName: z.string().optional().nullable(),
  tipperEmail: z.string().email("Invalid email address"),
  amount: z.number().min(100, "Minimum tip is ₦100"),
  message: z.string().optional().nullable(),
});

// Creator profile validators
export const creatorProfileSchema = z.object({
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(30, "Slug must be at most 30 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),
  bio: z.string().optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
});
