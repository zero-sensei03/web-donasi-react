import { useQuery } from '@tanstack/react-query';
import { getCampaignDonationPublic, getCampaignPublic } from './http';

export const useGetCampaignPublic = () => {
  return useQuery({
    queryKey: ['campaign'],
    queryFn: () => getCampaignPublic(),
    staleTime: 1000 * 60 * 60,
  });
};
export const useGetCampaignDonationPublic = (campaignId: string | null) => {
  return useQuery({
    queryKey: ['campaign-donation', campaignId],
    queryFn: () => getCampaignDonationPublic(campaignId || ''),
    refetchInterval: 1000 * 60 * 2,
    enabled: !!campaignId,
  });
};
