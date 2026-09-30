import { useAssistantStore } from "../../store/assistant.store";
import { assistantApi } from "../../services/assistant-api";
import {
  FileText,
  MessageCircle,
  HelpCircle,
  GraduationCap,
  LucideHand,
} from "lucide-react";
import { AssistantAction } from "../../types/assistant";
import { clsx } from "clsx";

export function ActionCards() {
  const {
    setAction,
    activeAction,
    setStreaming,
    setError,
    addMessage,
    updateLastMessage,
  } = useAssistantStore();

  const handleAction = async (action: AssistantAction) => {
    setAction(action);

    if (action === "summary" || action === "greeting") {
      setStreaming(true);
      setError(null);

      try {
        addMessage({
          id: Date.now().toString(),
          role: "assistant",
          content: "",
        });
        
        await assistantApi.fetchAction(
          action,
          undefined,
          undefined,
          undefined,
          (chunk) => {
            updateLastMessage(chunk);
          }
        );
      } catch (err: any) {
        if (err?.fallback) {
          updateLastMessage(err.fallback.message);
        } else {
          setError(err?.error?.message || "Failed to execute action.");
        }
      } finally {
        setStreaming(false);
      }
    } else {
      // For talk, help, teach, just set the action and welcome message
      let welcome = "";
      if (action === "talk")
        welcome = "Hi! How can I help you with your approvals today?";
      if (action === "help")
        welcome = "What operational question do you have about the policy?";
      if (action === "teach")
        welcome =
          "Hello! I can teach you about the approval process. What would you like to know?";

      addMessage({
        id: Date.now().toString(),
        role: "assistant",
        content: welcome,
      });
    }
  };

  const actions = [
    {
      id: "summary",
      label: "Present me Summary",
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      id: "talk",
      label: "Talk to me",
      icon: MessageCircle,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      id: "help",
      label: "Help me",
      icon: HelpCircle,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      id: "teach",
      label: "Teach me",
      icon: GraduationCap,
      color: "text-orange-600",
      bg: "bg-orange-100",
    }
  ];

  return (
    <div className="flex-1 grid grid-cols-2 gap-4 p-6 bg-white overflow-y-auto">
      {actions.map((a) => (
        <button
          key={a.id}
          onClick={() => handleAction(a.id as AssistantAction)}
          className={clsx(
            "flex flex-col items-center justify-center p-4 h-32 rounded-2xl border transition-all hover:shadow-md",
            activeAction === a.id
              ? "border-indigo-500 bg-indigo-50 shadow-sm"
              : "border-slate-100 bg-white hover:border-slate-200",
          )}
        >
          <div
            className={clsx(
              "w-12 h-12 rounded-full flex items-center justify-center mb-3",
              a.bg,
              a.color,
            )}
          >
            <a.icon size={24} />
          </div>
          <span className="text-sm font-medium text-slate-700">{a.label}</span>
        </button>
      ))}
    </div>
  );
}
