import api from '@/lib/axios';
import type { BaseResponse } from '@/interfaces/base.interface';
import type {
  CreateGalleryPayload,
  Gallery,
  GalleryListResponse,
  GalleryRes,
  GetGalleryParams,
  UpdateGalleryPayload,
} from '@/interfaces/gallery.interface';

export const getGalleryPublic = async (
  campaignId: string
): Promise<BaseResponse<GalleryRes[]>> => {
  const response = await api.get(`/public/gallery/campaign/${campaignId}`);
  return response.data;
};

export const getGalleryByCampaignId = async (
  campaignId: string,
  params?: GetGalleryParams
): Promise<GalleryListResponse> => {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: GalleryListResponse;
  }>(`/protected/gallery/campaign/${campaignId}`, {
    params,
  });

  return response.data.data;
};

export const getGalleryById = async (id: string): Promise<Gallery> => {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: Gallery;
  }>(`/protected/gallery/${id}`);

  return response.data.data;
};

export const createGallery = async (
  payload: CreateGalleryPayload
): Promise<Gallery> => {
  const formData = new FormData();

  formData.append('campaignId', payload.campaignId);
  formData.append('galleryType', payload.galleryType);

  if (payload.title?.trim()) {
    formData.append('title', payload.title.trim());
  }

  if (payload.description?.trim()) {
    formData.append('description', payload.description.trim());
  }

  formData.append('timeStamp', payload.timeStamp);
  formData.append('image', payload.image);

  if (payload.galleryType === 'VIDEO' && payload.video) {
    formData.append('video', payload.video);
  }

  const response = await api.post<{
    success: boolean;
    message: string;
    data: Gallery;
  }>('/protected/gallery', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
};

export const updateGallery = async (
  id: string,
  payload: UpdateGalleryPayload
): Promise<Gallery> => {
  const formData = new FormData();

  formData.append('campaignId', payload.campaignId);
  formData.append('galleryType', payload.galleryType);

  if (payload.title?.trim()) {
    formData.append('title', payload.title.trim());
  }

  if (payload.description?.trim()) {
    formData.append('description', payload.description.trim());
  }

  formData.append('timeStamp', payload.timeStamp);

  if (payload.image) {
    formData.append('image', payload.image);
  }

  if (payload.galleryType === 'VIDEO' && payload.video) {
    formData.append('video', payload.video);
  }

  const response = await api.put<{
    success: boolean;
    message: string;
    data: Gallery;
  }>(`/protected/gallery/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
};

export const deleteGallery = async (id: string): Promise<Gallery> => {
  const response = await api.delete<{
    success: boolean;
    message: string;
    data: Gallery;
  }>(`/protected/gallery/${id}`);

  return response.data.data;
};
