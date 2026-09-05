import api from "@/lib/axios";
import type { BaseResponse } from "@/interfaces/base.interface";
import type { DonationRes } from "@/interfaces/donation.interface";

export const getDonationPublic = async (campaignId: string): Promise<BaseResponse<DonationRes[]>> => {
  const response = await api.get(`/public/donation/campaign/${campaignId}?limit=8`);
  return response.data;
};

export const storeDonation = async (payload: FormData): Promise<BaseResponse<DonationRes>> => {
  const response = await api.post(`/public/donation`, payload, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })

  return response.data;
}
