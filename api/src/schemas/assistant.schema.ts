import { z } from "zod";

export const AssistantRequestSchema = z.object({
  action: z.enum(["summary", "talk", "help", "teach", "greeting"]),
  message: z.string().optional(),
  conversationId: z.string().optional(),
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string()
    })
  ).optional()
});

export type AssistantRequest = z.infer<typeof AssistantRequestSchema>;
