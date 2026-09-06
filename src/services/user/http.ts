import api from '@/lib/axios';

import type {
  CreateUserPayload,
  UpdateUserPayload,
  UserListResponse,
  User,
} from '@/interfaces/user.interface';

export interface GetUsersParams {
  page: number;
  limit: number;
  search?: string;
  status?: 'active' | 'inactive';
}

export const getUsers = async (
  params: GetUsersParams
): Promise<UserListResponse> => {
  const response = await api.get('/protected/user', {
    params: {
      page: params.page,
      limit: params.limit,
      ...(params.search
        ? {
            search: params.search,
          }
        : {}),
      ...(params.status
        ? {
            status: params.status,
          }
        : {}),
    },
  });

  return response.data.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await api.get(`/protected/user/${id}`);

  return response.data.data;
};

export const createUser = async (payload: CreateUserPayload): Promise<User> => {
  const response = await api.post('/protected/user', payload);

  return response.data.data;
};

export const updateUser = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateUserPayload;
}): Promise<User> => {
  const response = await api.put(`/protected/user/${id}`, payload);

  return response.data.data;
};

export const deleteUser = async (id: string): Promise<User> => {
  const response = await api.delete(`/protected/user/${id}`);

  return response.data.data;
};
