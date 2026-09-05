import { useQuery } from "@tanstack/react-query";
import { getGalleryPublic } from "./http";

export const useGetGalleryPublic = (campaignId: string | null) => {
  return useQuery({
    queryKey: ["gallery-public", campaignId],
    queryFn: () => getGalleryPublic(campaignId || ""),
    enabled: !!campaignId,
  })
};


