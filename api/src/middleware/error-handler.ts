import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request",
        details: err.errors,
      },
    });
    return;
  }

  if (err.message === "TIMEOUT") {
    res.status(503).json({
      error: {
        code: "AI_UNAVAILABLE",
        message: "The AI assistant is temporarily unavailable.",
      },
      fallback: {
        message:
          "You currently have pending approvals. Please review the queue manually.",
      },
    });
    return;
  }

  console.error("Unhandled error:", err);
  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "An internal server error occurred.",
    },
    fallback: {
      message:
        "You currently have pending approvals. Please review the queue manually.",
    },
  });
};
