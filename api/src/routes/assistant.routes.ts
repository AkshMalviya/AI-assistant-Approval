import { Router } from "express";
import { rateLimiter } from "../middleware/rate-limit";
import { validateBody } from "../middleware/validate";
import { AssistantRequestSchema } from "../schemas/assistant.schema";
import { handleMessage } from "../controllers/assistant/handleMessage.controller";

const router = Router();

router.post(
  "/assistant",
  validateBody(AssistantRequestSchema),
  rateLimiter,
  handleMessage,
);

export default router;
