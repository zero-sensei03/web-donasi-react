import api from '@/lib/axios';
import type {
  Notification,
  NotificationListResponse,
} from '@/interfaces/notification.interface';

const NOTIFICATION_ENDPOINT = '/protected/notification';

export interface GetNotificationsParams {
  page: number;
  limit: number;
}

export const getNotifications = async (
  params: GetNotificationsParams
): Promise<NotificationListResponse> => {
  const response = await api.get(NOTIFICATION_ENDPOINT, {
    params: {
      page: params.page,
      limit: params.limit,
    },
  });

  return response.data.data;
};

export const readNotification = async (id: string): Promise<Notification> => {
  const response = await api.patch(`${NOTIFICATION_ENDPOINT}/read/${id}`);

  return response.data.data;
};

export const readAllNotifications = async () => {
  const response = await api.patch(`${NOTIFICATION_ENDPOINT}/read`);

  return response.data.data;
};
