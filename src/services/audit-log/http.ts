import api from '@/lib/axios';
import type {
  AuditListResponse,
  GetAuditLogsParams,
} from '@/interfaces/audit.interface';

export const getAuditLogs = async (
  params: GetAuditLogsParams
): Promise<AuditListResponse> => {
  const response = await api.get('/protected/audit', {
    params: {
      page: params.page,
      limit: params.limit,

      ...(params.search
        ? {
            search: params.search,
          }
        : {}),

      ...(params.transaction
        ? {
            transaction: params.transaction,
          }
        : {}),

      ...(params.entity
        ? {
            entity: params.entity,
          }
        : {}),

      ...(params.startDate
        ? {
            startDate: params.startDate,
          }
        : {}),

      ...(params.endDate
        ? {
            endDate: params.endDate,
          }
        : {}),
    },
  });

  return response.data.data;
};
