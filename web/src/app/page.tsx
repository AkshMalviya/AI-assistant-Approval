"use client";

import { AssistantPanel } from "../components/assistant/AssistantPanel";
import { ApprovalList } from "../components/approvals/ApprovalList";

export default function Home() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
        <header className="bg-white border-b border-slate-200 px-8 py-6 shrink-0 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            Manage and review your security approvals.
          </p>
        </header>
        <div className="p-8 max-w-4xl w-full mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-800">
              Pending Approvals
            </h2>
            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold">
              4 pending
            </span>
          </div>
          <ApprovalList />
        </div>
      </main>
      <AssistantPanel />
    </div>
  );
}
