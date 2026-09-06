import api from '@/lib/axios';
import type { BaseResponse } from '@/interfaces/base.interface';
import type {
  SiteResponse,
  SiteSetting,
  UpdateSiteSettingPayload,
} from '@/interfaces/site.interface';

export const getSiteSettingPublic = async (): Promise<
  BaseResponse<SiteResponse[]>
> => {
  const response = await api.get(`/public/site-setting`);
  return response.data;
};

export const getSiteSettings = async (): Promise<SiteSetting[]> => {
  const response = await api.get('protected/site-setting');

  return response.data.data;
};

export const updateSiteSetting = async (
  payload: UpdateSiteSettingPayload
): Promise<SiteSetting> => {
  const response = await api.patch('protected/site-setting', payload);

  return response.data.data;
};

export const updateSiteSettingLogo = async (
  file: File
): Promise<SiteSetting> => {
  const formData = new FormData();

  formData.append('logo', file);

  const response = await api.patch('protected/site-setting/logo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
};
