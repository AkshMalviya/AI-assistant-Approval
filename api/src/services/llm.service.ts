import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
import { CONFIGS } from "../config";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy",
  baseURL: CONFIGS.LLM_BASE_URL,
});
