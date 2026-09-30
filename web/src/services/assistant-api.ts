import { AssistantAction, Message } from "../types/assistant";

const API_URL = "http://localhost:4000/api/assistant";

export const assistantApi = {
  async fetchAction(
    action: AssistantAction, 
    message?: string, 
    messages?: Message[], 
    conversationId?: string,
    onChunk?: (chunk: string) => void
  ) {
    const payload = {
      action,
      message,
      messages: messages?.map(m => ({ role: m.role, content: m.content })),
      conversationId
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw errorData;
    }

    // Check if it's chunked/streaming
    const isChunked = response.headers.get("Transfer-Encoding") === "chunked" || 
                     response.headers.get("Content-Type")?.includes("text/plain");

    if (isChunked && response.body && onChunk) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        onChunk(chunk);
      }
      return null;
    }

    return response.json();
  }
};
