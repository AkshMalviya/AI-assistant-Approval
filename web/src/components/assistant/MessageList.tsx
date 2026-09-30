import { useAssistantStore } from "../../store/assistant.store";
import { Message } from "./Message";
import { useEffect, useRef } from "react";

export function MessageList() {
  const { messages, isStreaming, error } = useAssistantStore();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50">
      {messages.length === 0 && !isStreaming && (
        <div className="text-center text-slate-400 text-sm mt-8">
          Select an action below or type a message to start.
        </div>
      )}
      {messages.map((msg, index) => (
        <Message 
          key={msg.id} 
          message={msg} 
          isStreaming={isStreaming && index === messages.length - 1} 
        />
      ))}
      {isStreaming && (
        <div className="flex items-center gap-2 text-indigo-500 text-sm ml-12">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
          </span>
          AI is thinking...
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mx-12">
          {error}
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}
