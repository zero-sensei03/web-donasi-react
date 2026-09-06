export interface GalleryRes {
  id: string;
  campaignId: string;
  galleryType: 'IMAGE' | 'VIDEO';
  imageUrl: string;
  videoUrl: string | null;
  title: string;
  description: string | null;
  timeStamp: string;
}

export type GalleryType = 'IMAGE' | 'VIDEO';

export interface Gallery {
  id: string;
  campaignId: string;
  galleryType: GalleryType;
  title: string | null;
  description: string | null;
  timeStamp: string;
  imageUrl: string;
  videoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryListResponse {
  items: Gallery[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetGalleryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateGalleryPayload {
  campaignId: string;
  galleryType: GalleryType;
  title?: string;
  description?: string;
  timeStamp: string;
  image: File;
  video?: File;
}

export interface UpdateGalleryPayload {
  campaignId: string;
  galleryType: GalleryType;
  title?: string;
  description?: string;
  timeStamp: string;
  image?: File;
  video?: File;
}
