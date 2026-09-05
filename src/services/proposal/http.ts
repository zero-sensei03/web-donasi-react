import api from "@/lib/axios";
import type { BaseResponse } from "@/interfaces/base.interface";
import type { ProposalRes } from "@/interfaces/proposal.interface";

export const getProposalPublic = async (campaignId: string): Promise<BaseResponse<ProposalRes[]>> => {
  const response = await api.get(`/public/proposal/campaign/${campaignId}`);
  return response.data;
};