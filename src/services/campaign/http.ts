import api from "@/lib/axios";
import type { BaseResponse } from "@/interfaces/base.interface";
import type { CampaignPublicRes, DonationCampaignRes } from "@/interfaces/campaign.interface";

export const getCampaignPublic = async (): Promise<BaseResponse<CampaignPublicRes | null>> => {
  const response = await api.get(`/public/campaign`);
  return response.data;
};
export const getCampaignDonationPublic = async (campaignId: string): Promise<BaseResponse<DonationCampaignRes>> => {
  const response = await api.get(`/public/campaign/donation/${campaignId}`);
  return response.data;
};