import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POLICY_PATH = path.join(__dirname, "../data/approval-policy.md");

export class RagService {
  private chunks: string[] = [];

  constructor() {
    this.loadPolicy();
  }

  private loadPolicy() {
    try {
      const content = fs.readFileSync(POLICY_PATH, "utf-8");
      // Split by heading for simple chunks, ignoring the main title if it doesn't contain a ## heading
      this.chunks = content
        .split(/(?=## )/g)
        .map((chunk) => chunk.trim())
        .filter((chunk) => chunk.startsWith("##"));
    } catch (error) {
      console.error("Failed to load policy document", error);
    }
  }

  public retrieve(query: string) {
    const terms = query.toLowerCase().split(/\s+/);
    
    // Simple keyword matching scoring
    const scoredChunks = this.chunks.map(chunk => {
      const lowerChunk = chunk.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (term.length > 2 && lowerChunk.includes(term)) {
          score++;
        }
      }
      return { chunk, score };
    });

    // Sort by score descending and get top 2
    scoredChunks.sort((a, b) => b.score - a.score);
    const topChunks = scoredChunks.slice(0, 2).filter(c => c.score > 0);

    return {
      results: topChunks
    };
  }
}

export const ragService = new RagService();
