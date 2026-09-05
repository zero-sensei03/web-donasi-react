import { useQuery } from "@tanstack/react-query";
import { getContactListPublic } from "./http";

export const useGetContactListPublic = (campaignId: string | null) => {
  return useQuery({
    queryKey: ["contact-list-campaign", campaignId],
    queryFn: () => getContactListPublic(campaignId || ""),
    enabled: !!campaignId
  })
};


