import api from '@/lib/axios';
import type { BaseResponse } from '@/interfaces/base.interface';
import type {
  Donation,
  DonationListResponse,
  DonationRes,
  GetDonationsParams,
  UpdateDonationStatusPayload,
} from '@/interfaces/donation.interface';

export const getDonationPublic = async (
  campaignId: string
): Promise<BaseResponse<DonationRes[]>> => {
  const response = await api.get(
    `/public/donation/campaign/${campaignId}?limit=8`
  );
  return response.data;
};

export const storeDonation = async (
  payload: FormData
): Promise<BaseResponse<DonationRes>> => {
  const response = await api.post(`/public/donation`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

const DONATION_ENDPOINT = '/protected/donation';

export const getDonationsByCampaign = async (
  params: GetDonationsParams
): Promise<DonationListResponse> => {
  const response = await api.get(
    `${DONATION_ENDPOINT}/campaign/${params.campaignId}`,
    {
      params: {
        page: params.page,
        limit: params.limit,
        ...(params.search ? { search: params.search } : {}),
        ...(params.status ? { status: params.status } : {}),
      },
    }
  );

  return response.data.data;
};

export const getDonationById = async (id: string): Promise<Donation> => {
  const response = await api.get(`${DONATION_ENDPOINT}/${id}`);

  return response.data.data;
};

export const updateDonationStatus = async (
  id: string,
  payload: UpdateDonationStatusPayload
): Promise<Donation> => {
  const response = await api.patch(
    `${DONATION_ENDPOINT}/${id}/status`,
    payload
  );

  return response.data.data;
};
