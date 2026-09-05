import { useQuery } from "@tanstack/react-query";
import { getProposalPublic } from "./http";

export const useGetProposalPublic = (campaignId: string | null) => {
  return useQuery({
    queryKey: ["proposal-campaign", campaignId],
    queryFn: () => getProposalPublic(campaignId || ""),
    enabled: !!campaignId
  })
};


