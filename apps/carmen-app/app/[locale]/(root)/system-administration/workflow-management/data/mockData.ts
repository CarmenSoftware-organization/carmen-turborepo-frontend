import { enum_available_actions, RoutingRule, Template, Workflow, Product } from "../types/workflow";

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

const initialProducts: Product[] = [
  { id: 1, name: "Room Service", code: "RS", category: "Service" },
  { id: 2, name: "Laundry Service", code: "LS", category: "Service" },
  { id: 3, name: "Food & Beverage", code: "FB", category: "Product" },
  { id: 4, name: "Spa Service", code: "SS", category: "Service" },
  { id: 5, name: "Meeting Room", code: "MR", category: "Facility" },
];

export const sampleWorkflows: Workflow[] = [
  {
    id: "d2c8e1b9-f146-40de-9139-bdbbdba527bc",
    name: "General Purchase Workflow",
    workflow_type: "purchase_request",
    data: {
      document_reference_pattern: "GP-{YYYY}-{00000}",
      stages: [
        {
          id: 1,
          name: "Request Creation",
          description: "Initial stage for creating and submitting requests",
          sla: "4",
          sla_unit: "hours",
          available_actions: [enum_available_actions.submit],
          hide_fields: {
            price_per_unit: false,
            total_price: false,
          },
          assigned_users: [],
        },
        {
          id: 2,
          name: "Purchasing Review",
          description: "Review by purchasing staff for accuracy and completeness",
          sla: "8",
          sla_unit: "hours",
          available_actions: [
            enum_available_actions.approve,
            enum_available_actions.reject,
            enum_available_actions.sendback,
          ],
          hide_fields: {
            price_per_unit: false,
            total_price: false,
          },
          assigned_users: [],
        },
        {
          id: 3,
          name: "Department Approval",
          description: "Review and approval by department head",
          sla: "12",
          sla_unit: "hours",
          available_actions: [
            enum_available_actions.approve,
            enum_available_actions.reject,
            enum_available_actions.sendback,
          ],
          hide_fields: {
            price_per_unit: false,
            total_price: false,
          },
          assigned_users: [],
        },
        {
          id: 4,
          name: "Finance Review",
          description: "Financial review and budget verification",
          sla: "24",
          sla_unit: "hours",
          available_actions: [
            enum_available_actions.approve,
            enum_available_actions.reject,
            enum_available_actions.sendback,
          ],
          hide_fields: {
            price_per_unit: false,
            total_price: false,
          },
          assigned_users: [],
        },
        {
          id: 5,
          name: "Final Approval",
          description: "Final approval by general manager",
          sla: "48",
          sla_unit: "hours",
          available_actions: [
            enum_available_actions.approve,
            enum_available_actions.reject,
            enum_available_actions.sendback,
          ],
          hide_fields: {
            price_per_unit: false,
            total_price: false,
          },
          assigned_users: [],
        },
        {
          id: 6,
          name: "Completed",
          description: "Request has been completed",
          sla: "0",
          sla_unit: "hours",
          available_actions: [],
          hide_fields: {
            price_per_unit: false,
            total_price: false,
          },
          assigned_users: [],
        },
      ],
      routing_rules: [
        {
          id: 1,
          name: "Amount <= 10,000 BAHT",
          description: "Skip to Completed for amounts less than or equal to 10,000 BAHT",
          trigger_stage: "Finance Review",
          condition: { field: "amount", operator: "lte", value: "10000" },
          action: {
            type: "SKIP_STAGE",
            parameters: { target_stage: "Completed" },
          },
        },
        {
          id: 2,
          name: "Amount > 10,000 BAHT",
          description: "Route to GM Approval for amounts greater than 10,000 BAHT",
          trigger_stage: "Finance Review",
          condition: { field: "amount", operator: "gt", value: "10000" },
          action: {
            type: "NEXT_STAGE",
            parameters: { target_stage: "Final Approval" },
          },
        },
      ],
      notifications: [
        {
          id: 1,
          event: "Request Submitted",
          event_trigger: "onSubmit",
          recipients: ["Requester", "Purchasing Staff"],
          channels: ["Email", "System"],
        },
        {
          id: 2,
          event: "Pending Approval",
          event_trigger: "onSubmit",
          recipients: ["Current Approver"],
          channels: ["Email", "System"],
        },
        {
          id: 3,
          event: "Request Approved",
          event_trigger: "onApprove",
          recipients: ["Requester", "Previous Approver", "Next Approver"],
          channels: ["Email", "System"],
        },
        {
          id: 4,
          event: "Request Rejected",
          event_trigger: "onReject",
          recipients: ["Requester", "All Previous Approvers"],
          channels: ["Email", "System"],
        },
        {
          id: 5,
          event: "SLA Warning",
          event_trigger: "onSLA",
          recipients: ["Current Approver", "Approver's Manager"],
          channels: ["Email", "System"],
        },
      ],
      notification_templates,
      products: [initialProducts[0], initialProducts[2]],
    },
    description: "Workflow for general purchase requests in a hotel environment",
    is_active: true,
  },
  {
    id: "WF-002",
    name: "Market List Workflow",
    workflow_type: "purchase_request",
    data: {
      document_reference_pattern: "ML-{YYYY}-{00000}",
      stages: [
        {
          id: 1,
          name: "Request Creation",
          description: "Initial stage for creating market list requests",
          sla: "2",
          sla_unit: "hours",
          available_actions: [enum_available_actions.submit],
          hide_fields: {
            price_per_unit: false,
            total_price: false,
          },
          assigned_users: [],
        },
        {
          id: 2,
          name: "Department Approval",
          description: "Department head review of market list",
          sla: "4",
          sla_unit: "hours",
          available_actions: [
            enum_available_actions.approve,
            enum_available_actions.reject,
            enum_available_actions.sendback,
          ],
          hide_fields: {
            price_per_unit: false,
            total_price: false,
          },
          assigned_users: [],
        },
        {
          id: 3,
          name: "Purchasing Review",
          description: "Review by purchasing for market list items",
          sla: "6",
          sla_unit: "hours",
          available_actions: [
            enum_available_actions.approve,
            enum_available_actions.reject,
            enum_available_actions.sendback,
          ],
          hide_fields: {
            price_per_unit: false,
            total_price: false,
          },
          assigned_users: [],
        },
        {
          id: 4,
          name: "Completed",
          description: "Market list request has been completed",
          sla: "0",
          sla_unit: "hours",
          available_actions: [],
          hide_fields: {
            price_per_unit: false,
            total_price: false,
          },
          assigned_users: [],
        },
      ],
      routing_rules: [
        {
          id: 1,
          name: "Amount <= 5,000 BAHT",
          description: "Skip to Completed for amounts less than or equal to 5,000 BAHT",
          trigger_stage: "Department Approval",
          condition: { field: "amount", operator: "lte", value: "5000" },
          action: {
            type: "SKIP_STAGE",
            parameters: { target_stage: "Completed" },
          },
        },
      ],
      notifications: [
        {
          id: 1,
          event: "Request Submitted",
          event_trigger: "onSubmit",
          recipients: ["Requester", "Department Head"],
          channels: ["Email", "System"],
        },
        {
          id: 2,
          event: "Request Approved",
          event_trigger: "onApprove",
          recipients: ["Requester", "Purchasing Staff"],
          channels: ["Email", "System"],
        },
        {
          id: 3,
          event: "Request Finalised",
          event_trigger: "onApprove",
          recipients: ["Requester", "Department Head", "Purchasing Staff"],
          channels: ["Email", "System"],
        },
      ],
      notification_templates: [],
      products: [initialProducts[2], initialProducts[3]],
    },
    description: "Workflow for market list requests in a hotel environment",
    is_active: true,
  },
];

export const mockRoutingRules: RoutingRule[] = sampleWorkflows[0].data?.routing_rules;
