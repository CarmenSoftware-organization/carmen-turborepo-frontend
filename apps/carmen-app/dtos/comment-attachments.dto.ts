export type SupportedMimeType =
  | "application/pdf"
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export interface AttachmentDto {
  size: number;
  fileUrl: string;
  fileName: string;
  fileToken: string;
  contentType: SupportedMimeType;
}

export interface BaseCommentAttachmentDto {
  type: string;
  user_id: string;
  message: string;
  attachments?: AttachmentDto[];
  created_at: string;
  created_by_id: string;
  updated_at?: string | null;
  updated_by_id?: string | null;
  deleted_at?: string | null;
  deleted_by_id?: string | null;
}

// PR
export interface CreatePrCommentAttachmentDto extends BaseCommentAttachmentDto {
  purchase_request_id: string;
}

export interface GetPrCommentAttachmentDto extends CreatePrCommentAttachmentDto {
  id: string;
}

// GRN
export interface CreateGrnCommentAttachmentDto extends BaseCommentAttachmentDto {
  grn_id: string;
}

export interface GetGrnCommentAttachmentDto extends CreateGrnCommentAttachmentDto {
  id: string;
}

// PO
export interface CreatePoCommentAttachmentDto extends BaseCommentAttachmentDto {
  po_id: string;
}

export interface GetPoCommentAttachmentDto extends CreatePoCommentAttachmentDto {
  id: string;
}

// SR
export interface CreateSrCommentAttachmentDto extends BaseCommentAttachmentDto {
  sr_id: string;
}

export interface GetSrCommentAttachmentDto extends CreateSrCommentAttachmentDto {
  id: string;
}
