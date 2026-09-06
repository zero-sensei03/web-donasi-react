export interface ProposalRes {
  id: string;
  campaignId: string;
  title: string;
  description: string;
  proposalPdfUrl: string;
  status: 'DRAFT' | 'ARCHIVED' | 'PUBLISHED';
}

export type ProposalStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface CampaignProposal {
  id: string;
  campaignId: string;
  title: string;
  description: string;
  proposalPdfUrl: string;
  status: ProposalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProposalPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProposalListResponse {
  items: CampaignProposal[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateProposalPayload {
  campaignId: string;
  title: string;
  description: string;
  status: ProposalStatus;
  proposal?: File | null;
}
