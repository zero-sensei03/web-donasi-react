export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'EDITOR';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface UserPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserListResponse {
  data: User[];
  meta: UserPaginationMeta;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  role: 'ADMIN' | 'EDITOR';
  isActive?: boolean;
}

export interface UpdateUserPayload {
  email: string;
  password?: string;
  role: 'ADMIN' | 'EDITOR';
  isActive?: boolean;
}
