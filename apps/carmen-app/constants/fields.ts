import { enum_sla_unit } from "@/dtos/workflows.dto";

export const slaUnitField = [
  { label: "Minutes", value: enum_sla_unit.minutes },
  { label: "Hours", value: enum_sla_unit.hours },
  { label: "Days", value: enum_sla_unit.days },
];

export const roleField = [
  { label: "Create", value: "create" },
  { label: "Approve", value: "approve" },
  { label: "Purchase", value: "purchase" },
  { label: "Issue", value: "issue" },
];
