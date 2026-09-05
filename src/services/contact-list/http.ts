import api from "@/lib/axios";
import type { BaseResponse } from "@/interfaces/base.interface";
import type { ContactListRes } from "@/interfaces/contact-list.interface";

export const getContactListPublic = async (campaignId: string): Promise<BaseResponse<ContactListRes[]>> => {
  const response = await api.get(`/public/contact-list/campaign/${campaignId}`);
  return response.data;
};