import { useQuery } from '@tanstack/react-query';
import { getPaymentPublic } from './http';

export const useGetPaymentPublic = (campaignId: string | null) => {
  return useQuery({
    queryKey: ['payment-public', campaignId],
    queryFn: () => getPaymentPublic(campaignId || ''),
    enabled: !!campaignId,
  });
};
