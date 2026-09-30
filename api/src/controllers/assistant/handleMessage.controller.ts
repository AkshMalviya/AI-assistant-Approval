import type { NextFunction, Request, Response } from "express";
import type { AssistantRequest } from "../../schemas/assistant.schema";
import { assistantService } from "../../services/assistant.service";
import { withTimeout } from "../../utils/timeout";

export const handleMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedRequest = req.body as AssistantRequest;

    const result = await withTimeout(
      assistantService.handleAction(validatedRequest),
      8000,
    );

    // if the result is a stream (for chat, help, teach)
    if (
      result &&
      typeof result === "object" &&
      Symbol.asyncIterator in result
    ) {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Transfer-Encoding", "chunked");
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no");

      for await (const chunk of result as any) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          // Send character by character with a small delay for a smooth "ChatGPT" typewriter effect
          for (const char of content) {
            res.write(char);
            await new Promise(r => setTimeout(r, 15)); // 15ms per character
          }
        }
      }
      res.end();
    } else {
      // static JSON response
      res.json(result);
    }
  } catch (error) {
    next(error);
  }
};
