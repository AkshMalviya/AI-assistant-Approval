import { create } from "zustand";
import { AssistantAction, Message } from "../types/assistant";

export interface AssistantState {
  isOpen: boolean;
  isFullScreen: boolean;
  activeAction: AssistantAction;
  conversationId: string | null;
  messages: Message[];
  isStreaming: boolean;
  error: string | null;
  toggleOpen: () => void;
  toggleFullScreen: () => void;
  setAction: (action: AssistantAction) => void;
  addMessage: (message: Message) => void;
  updateLastMessage: (content: string) => void;
  setStreaming: (isStreaming: boolean) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
}

export const useAssistantStore = create<AssistantState>((set) => ({
  isOpen: false,
  isFullScreen: false,
  activeAction: null,
  conversationId: "conv_" + Math.random().toString(36).substring(7),
  messages: [],
  isStreaming: false,
  error: null,
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  toggleFullScreen: () => set((state) => ({ isFullScreen: !state.isFullScreen })),
  setAction: (action) => set({ activeAction: action }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateLastMessage: (content) => set((state) => {
    const newMessages = [...state.messages];
    if (newMessages.length > 0) {
      newMessages[newMessages.length - 1].content += content;
    }
    return { messages: newMessages };
  }),
  setStreaming: (isStreaming) => set({ isStreaming }),
  setError: (error) => set({ error }),
  clearMessages: () => set({ messages: [] })
}));
