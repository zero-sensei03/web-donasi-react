import api from '@/lib/axios';
import type { BaseResponse } from '@/interfaces/base.interface';
import type {
  CampaignProposal,
  CreateProposalPayload,
  ProposalListResponse,
  ProposalRes,
} from '@/interfaces/proposal.interface';

export const getProposalPublic = async (
  campaignId: string
): Promise<BaseResponse<ProposalRes[]>> => {
  const response = await api.get(`/public/proposal/campaign/${campaignId}`);
  return response.data;
};

const PROPOSAL_ENDPOINT = '/protected/proposal';

export interface GetProposalsParams {
  campaignId: string;
  page: number;
  limit: number;
  search?: string;
  status?: string;
}

export const getProposals = async (
  params: GetProposalsParams
): Promise<ProposalListResponse> => {
  const response = await api.get(
    `${PROPOSAL_ENDPOINT}/campaign/${params.campaignId}`,
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

export const createProposal = async (
  payload: CreateProposalPayload
): Promise<CampaignProposal> => {
  const formData = new FormData();

  formData.append('campaignId', payload.campaignId);
  formData.append('title', payload.title);
  formData.append('description', payload.description);
  formData.append('status', payload.status);

  if (payload.proposal) {
    formData.append('proposal', payload.proposal);
  }

  const response = await api.post(PROPOSAL_ENDPOINT, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
};

export const updateProposal = async (
  id: string,
  payload: CreateProposalPayload
): Promise<CampaignProposal> => {
  const formData = new FormData();

  formData.append('campaignId', payload.campaignId);
  formData.append('title', payload.title);
  formData.append('description', payload.description);
  formData.append('status', payload.status);

  if (payload.proposal) {
    formData.append('proposal', payload.proposal);
  }

  const response = await api.put(`${PROPOSAL_ENDPOINT}/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
};

export const deleteProposal = async (id: string): Promise<void> => {
  await api.delete(`${PROPOSAL_ENDPOINT}/${id}`);
};
