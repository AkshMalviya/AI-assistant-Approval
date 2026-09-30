import { Approval } from "../../types/assistant";
import { ApprovalCard } from "./ApprovalCard";

const MOCK_APPROVALS: Approval[] = [
  { id: "approval_001", title: "Site Patrol Onboarding & Checklists Folder", owner: "Sam", status: "Pending Review", date: "Sep 18" },
  { id: "approval_002", title: "Level 2 Drone Patrol Video Demo", owner: "Alex", status: "Pending Review", date: "Sep 18" },
  { id: "approval_003", title: "Safety Equipment & Sensor Specs PDF", owner: "Sam", status: "Pending Review", date: "Sep 18" },
  { id: "approval_004", title: "360° Spatial Zone Layout & Camera Map Image", owner: "Elena", status: "Pending Review", date: "Sep 18" }
];

export function ApprovalList() {
  return (
    <div className="space-y-4">
      {MOCK_APPROVALS.map(approval => (
        <ApprovalCard key={approval.id} approval={approval} />
      ))}
    </div>
  );
}
