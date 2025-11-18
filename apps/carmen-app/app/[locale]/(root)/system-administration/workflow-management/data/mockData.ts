import { Template } from "@/dtos/workflows.dto";

const notification_templates: Template[] = [
  {
    id: 1,
    name: "Request Submitted",
    event_trigger: "onSubmit",
    description: "Template for when a request is submitted",
    subject_line: "New Purchase Request: {{request.number}}",
    content:
      "Dear {{approver.name}},\n\nA new purchase request ({{request.number}}) has been submitted by {{requestor.name}} from {{requestor.department}} and requires your attention.\n\nRequest Details:\nAmount: {{request.amount}}\nDate: {{request.date}}\n\nPlease review and take necessary action.\n\nBest regards,\n{{system.companyName}}",
  },
  {
    id: 2,
    name: "Request Approved",
    event_trigger: "onApprove",
    description: "Template for when a request is approved",
    subject_line: "Purchase Request Approved: {{request.number}}",
    content:
      "Dear {{requestor.name}},\n\nYour purchase request ({{request.number}}) has been approved by {{approver.name}}.\n\nThe request will now proceed to the next stage: {{workflow.nextStage}}.\n\nBest regards,\n{{system.companyName}}",
  },
  {
    id: 3,
    name: "Request Rejected",
    event_trigger: "onReject",
    description: "Template for when a request is rejected",
    subject_line: "Purchase Request Rejected: {{request.number}}",
    content:
      "Dear {{requestor.name}},\n\nYour purchase request ({{request.number}}) has been rejected by {{approver.name}}.\n\nPlease review the request and make necessary adjustments.\n\nBest regards,\n{{system.companyName}}",
  },
  {
    id: 4,
    name: "SLA Warning",
    event_trigger: "onSLA",
    description: "Template for SLA warning notifications",
    subject_line: "SLA Warning: Action Required for {{request.number}}",
    content:
      "Dear {{approver.name}},\n\nThis is a reminder that the purchase request ({{request.number}}) requires your attention.\n\nTime remaining: {{workflow.slaRemaining}}\n\nPlease take action as soon as possible.\n\nBest regards,\n{{system.companyName}}",
  },
];

const initialTemplates: Template[] = notification_templates.map((template) => {
  const initialTemplate = notification_templates.find((t) => t.id === template.id);
  return initialTemplate || template;
});

export { notification_templates, initialTemplates };
