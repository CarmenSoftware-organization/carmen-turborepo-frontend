export type OperatorType = "eq" | "lt" | "gt" | "lte" | "gte";
export type ActionType = "SKIP_STAGE" | "NEXT_STAGE";
export type NotificationChannel = "Email" | "System";
export type NotificationEventTrigger = "onSubmit" | "onApprove" | "onReject" | "onSendBack" | "onSLA";

export type AvailableActions = "submit" | "approve" | "reject" | "send_back";

export type PageMode = "add" | "edit" | "view";

export enum enum_available_actions {
  submit = "submit",
  approve = "approve",
  reject = "reject",
  sendback = "send_back",
}

export interface Product {
  id: number;
  name: string;
  code: string;
  category: string;
  subCategory?: string;
  itemGroup?: string;
}

export interface Stage {
  id: number;
  name: string;
  description: string;
  sla: string;
  sla_unit: string;
  available_actions: AvailableActions[];
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
  value: string;
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
