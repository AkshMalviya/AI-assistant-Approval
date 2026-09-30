import { useAssistantStore } from "../../store/assistant.store";
import { assistantApi } from "../../services/assistant-api";
import { useState } from "react";
import { Send } from "lucide-react";

export function MessageInput() {
  const [input, setInput] = useState("");
  const { addMessage, setStreaming, setError, activeAction, setAction, conversationId, updateLastMessage, messages } = useAssistantStore();

  const handleSend = async () => {
    if (!input.trim() || !activeAction) return;

    const userMsg = input.trim();
    setInput("");
    
    // If we're on a non-conversational action, switch to talk so the stream works
    const actionToSend = (activeAction === "summary" || activeAction === "greeting") ? "talk" : activeAction;
    if (actionToSend !== activeAction) {
      setAction(actionToSend);
    }

    addMessage({ id: Date.now().toString(), role: "user", content: userMsg });

    setStreaming(true);
    setError(null);
    addMessage({ id: (Date.now() + 1).toString(), role: "assistant", content: "" });

    try {
      await assistantApi.fetchAction(
        actionToSend,
        userMsg,
        messages,
        conversationId || undefined,
        (chunk) => {
          updateLastMessage(chunk);
        }
      );
    } catch (err: any) {
      if (err?.fallback) {
        updateLastMessage(err.fallback.message);
      } else {
        setError(err?.error?.message || "Something went wrong.");
      }
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-2">
      <input 
        type="text" 
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleSend()}
        placeholder={activeAction ? "Type your message..." : "Select an action first"}
        disabled={!activeAction}
        className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 transition-all"
      />
      <button 
        onClick={handleSend}
        disabled={!activeAction || !input.trim()}
        className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-full disabled:opacity-50 hover:bg-indigo-700 transition-colors"
      >
        <Send size={18} />
      </button>
    </div>
  );
}
