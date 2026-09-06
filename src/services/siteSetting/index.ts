import { useQuery } from '@tanstack/react-query';
import { getSiteSettingPublic } from './http';

export const useGetSiteSettingPublic = () => {
  return useQuery({
    queryKey: ['site-setting'],
    queryFn: () => getSiteSettingPublic(),
    staleTime: 1000 * 60 * 60,
  });
};
