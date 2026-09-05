import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDonationPublic, storeDonation } from "./http";
import type { BaseResponse } from "@/interfaces/base.interface";
import type { DonationRes } from "@/interfaces/donation.interface";
import type { AxiosError } from "axios";

export const useGetDonationPublic = (campaignId: string | null) => {
  return useQuery({
    queryKey: ["donation-public", campaignId],
    queryFn: () => getDonationPublic(campaignId || ""),
    refetchInterval: 1000 * 60 * 2,
    enabled: !!campaignId,
  })
};

export const useStoreDonation = () => {
  const queryClient = useQueryClient();
  return useMutation<BaseResponse<DonationRes>, AxiosError<BaseResponse>, FormData>({
    mutationFn: (formData) => storeDonation(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["donation-public"]
      })
    },
    onError: (error) => {
      throw error;
    },
  });
};
