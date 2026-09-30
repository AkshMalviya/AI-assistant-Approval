export type AssistantAction = "summary" | "talk" | "help" | "teach" | "greeting" | null;

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface Approval {
  id: string;
  title: string;
  owner: string;
  status: string;
  date: string;
}
