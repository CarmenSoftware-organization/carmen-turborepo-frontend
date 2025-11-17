// Status Types
export type StatusRfp = "active" | "inactive" | "draft" | "submit" | "completed";
export type StatusVendor = "completed" | "pending" | "in_progress";
export type PriorityType = "high" | "medium" | "low";
export type RfpType = "buy" | "sell" | "recurring";
export type SubmitMethodType = "auto" | "manual";

// Vendor Operations
export interface VendorOperations {
  add: string[];
  update: string[];
  remove: string[];
}

// Base Interface
interface BaseRfpDto {
  name: string;
  status: StatusRfp;
  description?: string;
  valid_period: number; // days
  create_date: Date;
  update_date: Date;
  vendors?: VendorOperations;
}

// List DTO
export interface RfpDto extends BaseRfpDto {
  id: string;
}

// Vendor Status
export interface VendorStatus {
  id: string;
  name: string;
  email: string;
  status: StatusVendor;
  progress: number;
  last_activity: Date;
  is_send: boolean;
}

// Reminder & Escalation Rules
export interface ReminderRule {
  type: "before_deadline" | "after_deadline";
  days: number;
  recipients: {
    type: "email" | "role" | "user_id";
    value: string;
  }[];
  message?: string;
  enabled: boolean;
}

// Settings
export interface RfpSettings {
  portal_duration: number;
  rfp_type: RfpType;
  submission_method: SubmitMethodType;
  require_approval: boolean;
  auto_reminder: boolean;
  priority: PriorityType;
  instructions?: string;
  reminders: ReminderRule[];
  escalations: ReminderRule[];
}

// Detail DTO with full information
export interface RfpDetailDto extends RfpDto {
  template: {
    id: string;
    name: string;
    start_date: Date;
    end_date: Date;
    created: {
      user: string;
      date: Date;
    };
  };
  performance?: {
    res_rate: number;
    avg_time: number;
    comp_rate: number;
    submission: string; // "1/3", "2/10" - submitted count / total count
  };
  vendor?: VendorStatus[];
  settings: RfpSettings;
}

// Request DTOs for API calls
export interface RfpCreateDto extends Omit<BaseRfpDto, "create_date" | "update_date"> {
  template_id?: string;
  settings: RfpSettings;
}

export interface RfpUpdateDto extends Omit<BaseRfpDto, "create_date" | "update_date"> {
  template_id?: string;
  settings: RfpSettings;
}
