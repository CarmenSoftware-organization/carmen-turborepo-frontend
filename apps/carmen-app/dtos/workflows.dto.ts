import { z } from "zod";

export enum enum_workflow_type {
  purchase_request = "purchase_request",
  purchase_order = "purchase_order",
  store_requisition = "store_requisition",
}

export const workflowTypeField = [
  { label: "Purchase Request", value: enum_workflow_type.purchase_request },
  { label: "Purchase Order", value: enum_workflow_type.purchase_order },
  { label: "Store Requisition", value: enum_workflow_type.store_requisition },
];

export enum enum_available_actions {
  submit = "submit",
  approve = "approve",
  reject = "reject",
  sendback = "sendback",
}

export enum enum_sla_unit {
  minutes = "minutes",
  hours = "hours",
  days = "days",
}

export type OperatorType = "eq" | "lt" | "gt" | "lte" | "gte";
export type ActionType = "SKIP_STAGE" | "NEXT_STAGE";
export type NotificationChannel = "Email" | "System";
export type NotificationEventTrigger = "onSubmit" | "onApprove" | "onReject" | "onSendBack" | "onSLA";

export type PageMode = "add" | "edit" | "view";

export interface Product {
  id: number;
  name: string;
  code: string;
  category: string;
  subCategory?: string;
  itemGroup?: string;
}

export interface Recipient {
  requestor: boolean;
  current_approve?: boolean;
  next_step?: boolean;
}

export interface ActionConfig {
  is_active: boolean;
  recipients: Recipient;
}

export interface AvailableActions {
  submit: ActionConfig;
  approve: ActionConfig;
  reject: ActionConfig;
  sendback: ActionConfig;
}

export interface Stage {
  name: string;
  description: string;
  sla: string;
  sla_unit: string;
  available_actions: AvailableActions;
  hide_fields: {
    price_per_unit: boolean;
    total_price: boolean;
  };
  assigned_users: {
    id: number;
    name: string;
    department: string;
    location: string;
  }[];
}

export interface RoutingCondition {
  field: string;
  operator: OperatorType;
  value: string[];
}

export interface RoutingAction {
  type: ActionType;
  parameters: {
    target_stage: string;
  };
}

export interface RoutingRule {
  id: number;
  name: string;
  description: string;
  trigger_stage: string;
  condition: RoutingCondition;
  action: RoutingAction;
}

export interface WorkflowNotification {
  id: number;
  event?: string;
  event_trigger?: NotificationEventTrigger;
  description?: string;
  recipients?: string[];
  channels?: NotificationChannel[];
}

export interface Template {
  id: number;
  name: string;
  event_trigger: NotificationEventTrigger;
  description?: string;
  subject_line: string;
  content: string;
}

export interface WorkflowData {
  document_reference_pattern: string;
  stages: Stage[];
  routing_rules: RoutingRule[];
  notifications: WorkflowNotification[];
  notification_templates: Template[];
  products: Product[];
}

export interface Workflow {
  id: string;
  name: string;
  workflow_type: string;
  data: WorkflowData;
  description: string;
  is_active: boolean;
}

export const wfFormSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(50),
  workflow_type: z.enum([
    enum_workflow_type.purchase_request,
    enum_workflow_type.purchase_order,
    enum_workflow_type.store_requisition,
  ]),
  data: z
    .object({
      document_reference_pattern: z.string(),
      stages: z.array(
        z.object({
          name: z.string().min(1).max(50),
          description: z.string(),
          sla: z.string(),
          sla_unit: z.enum([enum_sla_unit.minutes, enum_sla_unit.hours, enum_sla_unit.days]),
          available_actions: z.object({
            submit: z.object({
              is_active: z.boolean(),
              recipients: z.object({
                requestor: z.boolean(),
                current_approve: z.boolean(),
                next_step: z.boolean(),
              }),
            }),
            approve: z.object({
              is_active: z.boolean(),
              recipients: z.object({
                requestor: z.boolean(),
                current_approve: z.boolean(),
                next_step: z.boolean(),
              }),
            }),
            reject: z.object({
              is_active: z.boolean(),
              recipients: z.object({
                requestor: z.boolean(),
                current_approve: z.boolean(),
                next_step: z.boolean(),
              }),
            }),
            sendback: z.object({
              is_active: z.boolean(),
              recipients: z.object({
                requestor: z.boolean(),
                current_approve: z.boolean(),
                next_step: z.boolean(),
              }),
            }),
          }),
          hide_fields: z.object({
            price_per_unit: z.boolean(),
            total_price: z.boolean(),
          }),
          assigned_users: z.array(
            z.object({
              id: z.number(),
              name: z.string(),
              department: z.string(),
              location: z.string(),
            })
          ),
        })
      ),
      routing_rules: z.array(
        z.object({
          name: z.string(),
          description: z.string(),
          trigger_stage: z.string(),
          condition: z.object({
            field: z.string(),
            operator: z.enum(["eq", "lt", "gt", "lte", "gte"]),
            value: z.array(z.string()),
          }),
          action: z.object({
            type: z.enum(["SKIP_STAGE", "NEXT_STAGE"]),
            parameters: z.object({ target_stage: z.string() }),
          }),
        })
      ),
      notifications: z.array(z.object({})),
      notification_templates: z.array(z.object({})),
      products: z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          code: z.string(),
          category: z.string(),
          subCategory: z.string(),
          itemGroup: z.string(),
          isAssigned: z.boolean(),
        })
      ),
    })
    .optional(),
  description: z.string(),
  is_active: z.boolean(),
});

export type WorkflowCreateModel = z.infer<typeof wfFormSchema>;

