import { useQuery } from "@tanstack/react-query";
import { getDonationPublic } from "./http";

export const useGetDonationPublic = (campaignId: string | null) => {
  return useQuery({
    queryKey: ["donation-public", campaignId],
    queryFn: () => getDonationPublic(campaignId || ""),
    enabled: !!campaignId
  })
};


