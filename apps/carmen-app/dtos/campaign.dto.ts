// Status Types
export type StatusCampaign = "active" | "inactive" | "draft" | "submit" | "completed";
export type StatusVendor = "completed" | "pending" | "in_progress";
export type PriorityType = "high" | "medium" | "low";
export type CampaignType = "buy" | "sell" | "recurring";
export type SubmitMethodType = "auto" | "manual";

// Base Interface
interface BaseCampaignDto {
  name: string;
  status: StatusCampaign;
  description?: string;
  valid_period: Date;
  create_date: Date;
  update_date: Date;
}

// List DTO
export interface CampaignDto extends BaseCampaignDto {
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
export interface CampaignSettings {
  portal_duration: number;
  campaign_type: CampaignType;
  submission_method: SubmitMethodType;
  require_approval: boolean;
  auto_reminder: boolean;
  priority: PriorityType;
  instructions?: string;
  reminders: ReminderRule[];
  escalations: ReminderRule[];
}

// Detail DTO with full information
export interface CampaignDetailDto extends CampaignDto {
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
  settings: CampaignSettings;
}
