export interface DonationRes {
  donorName: string;
  amount: number;
  message: string | null;
  createdAt: string;
}

export type DonationStatus =
  'PENDING' | 'ACCEPTED' | 'REJECTED' | 'ACCEPTED_BY_REVISION';

export interface Donation {
  id: string;
  campaignId: string;
  donorName: string | null;
  message: string | null;
  amount: number;
  acceptedAmount: number | null;
  proofOfPaymentUrl: string | null;
  status: DonationStatus;
  reply: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DonationListResponse {
  items: Donation[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetDonationsParams {
  campaignId: string;
  page: number;
  limit: number;
  search?: string;
  status?: DonationStatus;
}

export interface UpdateDonationStatusPayload {
  status: DonationStatus;
  amount?: number;
  reply?: string | null;
}
