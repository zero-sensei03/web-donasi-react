import api from "@/lib/axios";
import type { BaseResponse } from "@/interfaces/base.interface";
import type { SiteResponse } from "@/interfaces/site.interface";

export const getSiteSettingPublic = async (): Promise<BaseResponse<SiteResponse[]>> => {
  const response = await api.get(`/public/site-setting`);
  return response.data;
};