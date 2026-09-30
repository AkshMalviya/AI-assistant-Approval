import { openai } from "./llm.service";
import { CONFIGS } from "../config";
import type { AssistantRequest } from "../schemas/assistant.schema";
import { SUMMARY_PROMPT_V1 } from "../prompts/summary";
import { CHAT_PROMPT_V1 } from "../prompts/chat";
import { HELP_PROMPT_V1 } from "../prompts/help";
import { TEACH_PROMPT_V1 } from "../prompts/teach";
import { GREETING_PROMPT_V1 } from "../prompts/greeting";
import { ragService } from "./rag.service";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { ChatCompletionMessageParam } from "openai/resources.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const APPROVALS_PATH = path.join(__dirname, "../data/approvals.json");

export class AssistantService {
  public async handleAction(request: AssistantRequest) {
    switch (request.action) {
      case "summary":
        return this.summary();
      case "talk":
        return this.talk(request);
      case "help":
        return this.help(request);
      case "teach":
        return this.teach(request);
      case "greeting":
        return this.greeting();
      default:
        throw new Error("Invalid action");
    }
  }

  private async summary() {
    const approvals = fs.readFileSync(APPROVALS_PATH, "utf-8");
    const prompt = SUMMARY_PROMPT_V1.replace("{approvals}", approvals);

    const stream = await openai.chat.completions.create({
      model: CONFIGS.LLM_MODEL,
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: "Please generate the summary now." },
      ],
      stream: true,
    });

    return stream;
  }

  private async talk(request: AssistantRequest) {
    const approvals = fs.readFileSync(APPROVALS_PATH, "utf-8");

    const query = request.message || "";
    const result = ragService.retrieve(query);
    const contextText = result.results.map((r) => r.chunk).join("\n\n");

    const prompt = CHAT_PROMPT_V1.replace("{approvals}", approvals).replace(
      "{context}",
      contextText,
    );

    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: prompt },
    ];

    if (request.messages) {
      for (const msg of request.messages) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }

    if (request.message) {
      messages.push({ role: "user", content: request.message });
    }

    const stream = await openai.chat.completions.create({
      model: CONFIGS.LLM_MODEL,
      messages,
      stream: true,
    });

    return stream;
  }

  private async help(request: AssistantRequest) {
    const query = request.message || "";
    const result = ragService.retrieve(query);
    const contextText = result.results.map((r) => r.chunk).join("\n\n");

    const prompt = HELP_PROMPT_V1.replace("{context}", contextText);

    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: prompt },
    ];

    if (request.messages) {
      for (const msg of request.messages) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }

    if (request.message) {
      messages.push({ role: "user", content: request.message });
    }

    const stream = await openai.chat.completions.create({
      model: CONFIGS.LLM_MODEL,
      messages,
      stream: true,
    });

    return stream;
  }

  private async teach(request: AssistantRequest) {
    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: TEACH_PROMPT_V1 },
    ];

    if (request.messages) {
      for (const msg of request.messages) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }

    if (request.message) {
      messages.push({ role: "user", content: request.message });
    }

    const stream = await openai.chat.completions.create({
      model: CONFIGS.LLM_MODEL,
      messages,
      stream: true,
    });

    return stream;
  }

  private async greeting() {
    const approvals = fs.readFileSync(APPROVALS_PATH, "utf-8");
    const prompt = GREETING_PROMPT_V1.replace("{approvals}", approvals);

    const stream = await openai.chat.completions.create({
      model: CONFIGS.LLM_MODEL,
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: "Please generate the greeting now." },
      ],
      stream: true,
    });

    return stream;
  }
}

export const assistantService = new AssistantService();
