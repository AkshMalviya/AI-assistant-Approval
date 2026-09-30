# Crystal Ball Command Centre

This repository contains an implementation of the **OomniEye-style AI Approvals Assistant**. It features a modern, responsive React/Next.js dashboard combined with a secure, robust Node.js/Express backend to orchestrate interactions with an AI language model. 

## Project Architecture

The system is separated into a frontend and a backend to ensure a clean separation of concerns and to securely hide sensitive AI provider API keys.

1. **Frontend (`/web`)**: A Next.js application that uses TailwindCSS for styling and Zustand for state management. It connects to the Express API. It features the Assistant UI containing 5 distinct actions.
2. **Backend (`/api`)**: An Express.js API built with TypeScript. It serves as the orchestrator. It receives validated requests (via Zod schemas), processes them using specific services, retrieves context from mock data or local documents (RAG), queries OpenAI, and streams the responses back to the client.

### AI Architecture
The backend isolates LLM calls within specialized services (`summary`, `chat`, `help`, `teach`, `greeting`). It uses OpenAI's SDK. Responses are streamed directly via HTTP chunking to provide instant feedback to the user on the frontend. The `summary` endpoint leverages structured outputs to generate strict JSON formats validated against Zod schemas.

### RAG Approach
The Help feature uses a lightweight, in-memory Retrieval-Augmented Generation (RAG) approach. We load the `approval-policy.md` file, split it into logical sections by headers, and use a keyword-based similarity matching to score and rank the chunks. Only the top-scoring chunks are injected into the LLM context, which strictly constrains the AI to answer using only the retrieved information. No heavyweight vector databases are used, keeping the solution simple and aligned with requirements.

### Streaming Approach
Streaming is implemented using HTTP chunked transfer encoding from Express to Next.js. The backend forwards delta chunks from the OpenAI API directly to the `res.write()` buffer. On the frontend, the `Fetch API` consumes the `ReadableStream` incrementally, updating Zustand state chunk-by-chunk to render text dynamically.

## Setup Instructions

### Backend (API) Setup
\`\`\`bash
cd api
npm install
# Create an environment file with your OpenAI API Key
echo "OPENAI_API_KEY=your_key_here" > .env
# Start the server (Port 4000)
npm run dev
\`\`\`

### Frontend (Web) Setup
\`\`\`bash
cd web
npm install
# Start the Next.js app (Port 3000)
npm run dev
\`\`\`

---

## AI, Fallbacks, and Future Improvements

AI is utilized selectively to provide clear value where deterministic programming falls short. For instance, summarizing the nuances of approval items, generating context-aware conversational replies, and interpreting specific operational policy questions are highly suited for LLMs. However, AI is avoided for deterministic operations: loading the actual approval list, routing, handling state, and checking application health are strictly handled by standard code. We do not use AI to query structured data where an SQL query or simple filter would suffice.

Handling timeouts and API failures is a critical part of the system's resilience. An 8-second hard timeout wrapper ensures that if the LLM provider stalls or becomes unresponsive, the system degrades gracefully rather than hanging indefinitely. When a timeout or an internal API failure occurs, a centralized error handler intercepts it and returns a controlled fallback response, indicating that the AI is temporarily unavailable while still presenting the user with actionable, deterministic data (e.g., "You have 4 pending approvals. Please review the queue manually"). This ensures the user is never completely blocked.

With more time, I would introduce several improvements. First, I would replace the basic keyword search with an embedding-based similarity search (e.g., pgvector) to improve RAG accuracy for complex policy queries. I would also add user authentication and distinct user sessions to persist chat history across logins in a proper PostgreSQL database rather than just holding it in frontend Zustand state. Finally, I would implement robust observability and monitoring for LLM usage and latency.

(Note: AI coding assistants like GitHub Copilot and Google Gemini were used to accelerate the development of boilerplate configurations and standard UI components.)