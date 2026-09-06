import api from '@/lib/axios';
import type { BaseResponse } from '@/interfaces/base.interface';
import type {
  Campaign,
  CampaignListResponse,
  CampaignPublicRes,
  CreateCampaignPayload,
  DonationCampaignRes,
  UpdateCampaignPayload,
} from '@/interfaces/campaign.interface';

export const getCampaignPublic = async (): Promise<
  BaseResponse<CampaignPublicRes | null>
> => {
  const response = await api.get(`/public/campaign`);
  return response.data;
};
export const getCampaignDonationPublic = async (
  campaignId: string
): Promise<BaseResponse<DonationCampaignRes>> => {
  const response = await api.get(`/public/campaign/donation/${campaignId}`);
  return response.data;
};

const CAMPAIGN_ENDPOINT = '/protected/campaign';

export interface GetCampaignsParams {
  page: number;
  limit: number;
  search?: string;
}

export const getCampaigns = async (
  params: GetCampaignsParams
): Promise<CampaignListResponse> => {
  const response = await api.get(CAMPAIGN_ENDPOINT, {
    params: {
      page: params.page,
      limit: params.limit,
      ...(params.search ? { search: params.search } : {}),
    },
  });

  return response.data.data;
};

export const getCampaignById = async (id: string): Promise<Campaign> => {
  const response = await api.get(`${CAMPAIGN_ENDPOINT}/${id}`);

  return response.data.data;
};

export const createCampaign = async (
  payload: CreateCampaignPayload
): Promise<Campaign> => {
  const response = await api.post(CAMPAIGN_ENDPOINT, payload);

  return response.data.data;
};

export const updateCampaign = async (
  id: string,
  payload: UpdateCampaignPayload
): Promise<Campaign> => {
  const response = await api.put(`${CAMPAIGN_ENDPOINT}/${id}`, payload);

  return response.data.data;
};

export const deleteCampaign = async (id: string): Promise<Campaign> => {
  const response = await api.delete(`${CAMPAIGN_ENDPOINT}/${id}`);

  return response.data.data;
};

export const restoreCampaign = async (id: string): Promise<Campaign> => {
  const response = await api.patch(`${CAMPAIGN_ENDPOINT}/${id}/restore`);

  return response.data.data;
};

export const hardDeleteCampaign = async (id: string): Promise<Campaign> => {
  const response = await api.delete(`${CAMPAIGN_ENDPOINT}/${id}/hard`);

  return response.data.data;
};

export const setActiveCampaign = async (id: string): Promise<Campaign> => {
  const response = await api.patch(`${CAMPAIGN_ENDPOINT}/${id}/set-active`);

  return response.data.data;
};
