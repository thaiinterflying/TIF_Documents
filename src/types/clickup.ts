export interface ClickUpCustomFieldOption {
  id: string;
  name: string;
  color?: string;
  orderindex?: number;
}

export interface ClickUpCustomField {
  id: string;
  name: string;
  type: string;
  type_config?: {
    options?: ClickUpCustomFieldOption[];
    precision?: number;
    currency_type?: string;
    placeholder?: string;
  };
  date_created?: string;
  hide_from_guests?: boolean;
  value?: any;
  required?: boolean;
}

export interface ClickUpUser {
  id: number;
  username: string;
  email: string;
  color?: string;
  initials?: string;
  profilePicture?: string;
}

export interface ClickUpTag {
  name: string;
  tag_fg?: string;
  tag_bg?: string;
}

export interface ClickUpStatus {
  status: string;
  color: string;
  type: string;
  orderindex: number;
}

export interface ClickUpAttachment {
  id: string;
  date: string;
  title: string;
  type: number;
  source: number;
  version: number;
  extension: string;
  thumbnail_small?: string;
  thumbnail_medium?: string;
  thumbnail_large?: string;
  url: string;
  url_w_query?: string;
  url_w_host?: string;
}

export interface ClickUpTask {
  id: string;
  custom_id?: string | null;
  name: string;
  text_content?: string;
  description?: string;
  status: ClickUpStatus;
  orderindex?: string;
  date_created?: string;
  date_updated?: string;
  date_closed?: string | null;
  date_done?: string | null;
  creator?: ClickUpUser;
  assignees?: ClickUpUser[];
  tags?: ClickUpTag[];
  due_date?: string | null;
  start_date?: string | null;
  custom_fields?: ClickUpCustomField[];
  attachments?: ClickUpAttachment[];
  url?: string;
}

export interface ClickUpApiResponse {
  task?: ClickUpTask;
  error?: string;
  err?: string;
  ECODE?: string;
}

export type ClickUpErrorCode =
  | 'TASK_NOT_FOUND'
  | 'AUTH_FAILED'
  | 'FORBIDDEN'
  | 'RATE_LIMITED'
  | 'NETWORK_ERROR'
  | 'TOKEN_MISSING'
  | 'INVALID_TASK_ID'
  | 'UNKNOWN';

export interface ClickUpServiceError {
  code: ClickUpErrorCode;
  message: string;
  status?: number;
}
