import { z } from "zod";

export const SummaryResponseSchema = z.object({
  type: z.literal("summary"),
  data: z.object({
    summary: z.string(),
    items: z.array(
      z.object({
        approvalId: z.string(),
        title: z.string(),
        priority: z.enum(["high", "medium", "low"]),
        reason: z.string()
      })
    )
  })
});

export type SummaryResponse = z.infer<typeof SummaryResponseSchema>;
