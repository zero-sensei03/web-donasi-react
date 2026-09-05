import api from "@/lib/axios";
import type { BaseResponse } from "@/interfaces/base.interface";
import type { GalleryRes } from "@/interfaces/gallery.interface";

export const getGalleryPublic = async (campaignId: string): Promise<BaseResponse<GalleryRes[]>> => {
  const response = await api.get(`/public/gallery/campaign/${campaignId}`);
  return response.data;
};