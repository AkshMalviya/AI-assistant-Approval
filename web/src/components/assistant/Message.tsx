import { Message as MessageType } from "../../types/assistant";
import { clsx } from "clsx";
import { Bot, User } from "lucide-react";

export function Message({ message, isStreaming }: { message: MessageType, isStreaming?: boolean }) {
  const isAssistant = message.role === "assistant";

  const createMarkup = (text: string) => {
    let html = text
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      // Italics
      .replace(/\*(.*?)\*/g, '<i>$1</i>')
      // Newlines to <br/>
      .replace(/\n/g, '<br/>');
      
    // Add blinking cursor for ChatGPT effect if streaming
    if (isStreaming && isAssistant) {
      html += '<span class="inline-block w-2 h-4 ml-1 align-middle bg-slate-400 animate-pulse"></span>';
    }
    
    return { __html: html };
  };

  return (
    <div className={clsx("flex gap-3", isAssistant ? "" : "flex-row-reverse")}>
      <div className={clsx(
        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
        isAssistant ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-600"
      )}>
        {isAssistant ? <Bot size={18} /> : <User size={18} />}
      </div>
      
      {isAssistant ? (
        <div 
          className="px-4 py-3 rounded-2xl max-w-[95%] text-sm bg-white border border-slate-100 text-slate-700 shadow-sm"
          dangerouslySetInnerHTML={createMarkup(message.content)}
        />
      ) : (
        <div className="px-4 py-3 rounded-2xl max-w-[95%] text-sm bg-indigo-600 text-white">
          {message.content}
        </div>
      )}
    </div>
  );
}
