import { useAssistantStore } from "../../store/assistant.store";
import { AssistantHeader } from "./AssistantHeader";
import { ActionCards } from "./ActionCards";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";

export function ChatWindow() {
  const { activeAction } = useAssistantStore();

  return (
    <div className="flex flex-col h-full bg-white md:border-l md:border-slate-200 shadow-xl md:shadow-none overflow-hidden relative">
      <AssistantHeader />
      {!activeAction ? (
        <ActionCards />
      ) : (
        <>
          <MessageList />
          <MessageInput />
        </>
      )}
    </div>
  );
}
