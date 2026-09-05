import api from "@/lib/axios";
import type { BaseResponse } from "@/interfaces/base.interface";
import type { PaymentRes } from "@/interfaces/payment.interface";

export const getPaymentPublic = async (campaignId: string): Promise<BaseResponse<PaymentRes[]>> => {
  const response = await api.get(`/public/payment-method/campaign/${campaignId}`);
  return response.data;
};