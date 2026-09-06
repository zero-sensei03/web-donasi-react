export type NotificationType = 'NEW_DONATION' | 'SYSTEM';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  donationId: string | null;
  createdAt: string;
}

export interface NotificationPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface NotificationListResult {
  data: Notification[];
  meta: NotificationPaginationMeta;
}

export interface NotificationListResponse {
  result: NotificationListResult;
  totalNotRead: number;
}
