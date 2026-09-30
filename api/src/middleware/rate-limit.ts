import type { Request, Response, NextFunction } from "express";

const rateLimits = new Map<string, { count: number; resetAt: number }>();

export const rateLimiter = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const ip = req.ip || "127.0.0.1";
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 20;

  const current = rateLimits.get(ip);
  if (!current || current.resetAt < now) {
    rateLimits.set(ip, { count: 1, resetAt: now + windowMs });
    return next();
  }

  if (current.count >= maxRequests) {
    res.status(429).json({
      error: {
        code: "RATE_LIMITED",
        message: "Too many requests. Please try again later.",
      },
    });
    return;
  }

  current.count += 1;
  next();
};
