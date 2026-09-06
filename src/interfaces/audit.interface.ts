export type AuditTransaction =
  'CREATE' | 'UPDATE' | 'DELETE' | 'VERIFY' | 'REJECT' | 'LOGIN' | 'LOGOUT';

export interface AuditUser {
  id: string;
  email: string;
}

export interface AuditLog {
  id: string;
  userId: string | null;
  transaction: AuditTransaction;
  entity: string;
  entityId: string | null;
  description: string | null;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  user: AuditUser | null;
}

export interface AuditPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AuditListResponse {
  data: AuditLog[];
  meta: AuditPaginationMeta;
}

export interface GetAuditLogsParams {
  page: number;
  limit: number;
  search?: string;
  transaction?: AuditTransaction;
  entity?: string;
  startDate?: string;
  endDate?: string;
}
