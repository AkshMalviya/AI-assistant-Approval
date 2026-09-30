import { Approval } from "../../types/assistant";
import { CheckCircle2, Clock } from "lucide-react";

export function ApprovalCard({ approval }: { approval: Approval }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <h3 className="font-semibold text-slate-800">{approval.title}</h3>
        <p className="text-sm text-slate-500 mt-1">Requested by {approval.owner} • {approval.date}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          {approval.status}
        </span>
      </div>
    </div>
  );
}
