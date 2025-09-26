import { rateLimit } from "express-rate-limit";

// Global rate limiter - light protection for all API endpoints
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1000, // High limit for general API use
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
});

// Strict rate limiter for authentication-related endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // Strict limit for auth operations
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
  message: {
    error: "Too many authentication attempts, please try again later.",
  },
});

// Message rate limiter - for real-time messaging
export const messageLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 30, // 30 messages per minute per IP
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
  message: {
    error: "Too many messages sent, please slow down.",
  },
});

// File upload rate limiter
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20, // 20 uploads per 15 minutes
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
  message: {
    error: "Too many file uploads, please try again later.",
  },
});
