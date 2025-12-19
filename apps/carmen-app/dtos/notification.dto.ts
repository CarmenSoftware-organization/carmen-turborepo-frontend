export interface NotificationDto {
  id: string;
  title: string;
  message: string;
  user_posted: string;
  created_at: string;
  read: boolean;
  link?: string;
}

export enum EnumNotiType {
  info = "info",
  success = "success",
  warning = "warning",
  error = "error",
}

export interface NotiPayloadDto {
  type: EnumNotiType;
  title: string;
  message: string;
  category: "system" | "user-to-user";
  to_user_id: string;
  from_user_id: string;
  link?: string;
}

export interface NotificationResponse {
  id: string;
  title: string;
  message: string;
  type: EnumNotiType;
  created_at: string;
  link?: string;
}
