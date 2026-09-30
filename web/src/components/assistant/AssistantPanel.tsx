import { useAssistantStore } from "../../store/assistant.store";
import { ChatWindow } from "./ChatWindow";
import { Bot } from "lucide-react";
import { clsx } from "clsx";

export function AssistantPanel() {
  const { isOpen, toggleOpen, isFullScreen } = useAssistantStore();

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={toggleOpen}
        className={clsx(
          "fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-indigo-700 transition-transform",
          isOpen && "scale-0",
        )}
      >
        <Bot size={24} />
      </button>

      {/* Main Panel */}
      <div
        className={clsx(
          "fixed z-40 transition-all duration-300 bg-white shadow-2xl overflow-hidden border border-slate-200 flex flex-col",
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-8 pointer-events-none",
          isFullScreen
            ? "top-4 left-4 right-4 bottom-4 rounded-xl"
            : "bottom-24 right-6 w-[350px] md:w-[400px] h-[600px] max-h-[calc(100vh-8rem)] rounded-2xl",
        )}
      >
        <ChatWindow />
      </div>
    </>
  );
}
