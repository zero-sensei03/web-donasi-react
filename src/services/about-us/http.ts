import api from '@/lib/axios';

import type {
  AboutUsSection,
  CampaignTimPayload,
  WorkStructurePayload,
  UpsertAboutUsPayload,
} from '@/interfaces/about.interface';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const createFormData = (data: UpsertAboutUsPayload): FormData => {
  const formData = new FormData();

  if (data.heroTagline !== undefined) {
    formData.append('heroTagline', data.heroTagline ?? '');
  }

  if (data.heroTitle !== undefined) {
    formData.append('heroTitle', data.heroTitle ?? '');
  }

  if (data.heroDescription !== undefined) {
    formData.append('heroDescription', data.heroDescription ?? '');
  }

  if (data.vision !== undefined) {
    formData.append('vision', data.vision ?? '');
  }

  if (data.mission !== undefined) {
    data.mission.forEach((item) => {
      formData.append('mission[]', item);
    });
  }

  if (data.image) {
    formData.append('image', data.image);
  }

  return formData;
};

const createTimFormData = (data: CampaignTimPayload): FormData => {
  const formData = new FormData();

  formData.append('aboutUsSectionId', data.aboutUsSectionId);
  formData.append('name', data.name);

  if (data.position !== undefined) {
    formData.append('position', data.position ?? '');
  }

  if (data.instagram !== undefined) {
    formData.append('instagram', data.instagram ?? '');
  }

  if (data.linkedin !== undefined) {
    formData.append('linkedin', data.linkedin ?? '');
  }

  if (data.image) {
    formData.append('image', data.image);
  }

  return formData;
};

export const getAboutByCampaignId = async (
  campaignId: string
): Promise<AboutUsSection | null> => {
  const response = await api.get<ApiResponse<AboutUsSection | null>>(
    `/protected/about-us/campaign/${campaignId}`
  );

  return response.data.data;
};

export const upsertAboutUs = async (
  campaignId: string,
  data: UpsertAboutUsPayload
): Promise<AboutUsSection> => {
  const formData = createFormData(data);

  const response = await api.post<ApiResponse<AboutUsSection>>(
    `/protected/about-us/campaign/${campaignId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data.data;
};

export const createCampaignTim = async (
  data: CampaignTimPayload
): Promise<CampaignTimPayload> => {
  const formData = createTimFormData(data);

  const response = await api.post<ApiResponse<CampaignTimPayload>>(
    `/protected/about-us/campaign-tim`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data.data;
};

export const updateCampaignTim = async (
  id: string,
  data: CampaignTimPayload
): Promise<CampaignTimPayload> => {
  const formData = createTimFormData(data);

  const response = await api.put<ApiResponse<CampaignTimPayload>>(
    `/protected/about-us/campaign-tim/${id}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data.data;
};

export const deleteCampaignTim = async (id: string): Promise<void> => {
  await api.delete(`/protected/about-us/campaign-tim/${id}`);
};

export const createWorkStructure = async (
  data: WorkStructurePayload
): Promise<WorkStructurePayload> => {
  const response = await api.post<ApiResponse<WorkStructurePayload>>(
    `/protected/about-us/campaign-work-structure`,
    data
  );

  return response.data.data;
};

export const updateWorkStructure = async (
  id: string,
  data: WorkStructurePayload
): Promise<WorkStructurePayload> => {
  const response = await api.put<ApiResponse<WorkStructurePayload>>(
    `/protected/about-us/campaign-work-structure/${id}`,
    data
  );

  return response.data.data;
};

export const deleteWorkStructure = async (id: string): Promise<void> => {
  await api.delete(`/protected/about-us/campaign-work-structure/${id}`);
};
