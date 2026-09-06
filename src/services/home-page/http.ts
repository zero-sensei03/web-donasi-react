import api from '@/lib/axios';

import type {
  HomePageSection,
  SupportWorkPayload,
  UpsertHomePagePayload,
  WhySectionPayload,
} from '@/interfaces/home-page.interface';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const createHomePageFormData = (data: UpsertHomePagePayload): FormData => {
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

  if (data.whyHomeDescription !== undefined) {
    formData.append('whyHomeDescription', data.whyHomeDescription ?? '');
  }

  if (data.supportWorkTagline !== undefined) {
    formData.append('supportWorkTagline', data.supportWorkTagline ?? '');
  }

  if (data.supportWorkDescription !== undefined) {
    formData.append(
      'supportWorkDescription',
      data.supportWorkDescription ?? ''
    );
  }

  if (data.ctaSectionTagline !== undefined) {
    formData.append('ctaSectionTagline', data.ctaSectionTagline ?? '');
  }

  if (data.ctaSectionTitle !== undefined) {
    formData.append('ctaSectionTitle', data.ctaSectionTitle ?? '');
  }

  if (data.ctaSectionSubtitle !== undefined) {
    formData.append('ctaSectionSubtitle', data.ctaSectionSubtitle ?? '');
  }

  if (data.heroImage) {
    formData.append('heroImage', data.heroImage);
  }

  if (data.ctaImage) {
    formData.append('ctaImage', data.ctaImage);
  }

  return formData;
};

const createWhyFormData = (data: WhySectionPayload): FormData => {
  const formData = new FormData();

  formData.append('homePageSectionId', data.homePageSectionId);

  if (data.icon !== undefined) {
    formData.append('icon', data.icon ?? '');
  }

  formData.append('title', data.title);

  if (data.subTitle !== undefined) {
    formData.append('subTitle', data.subTitle ?? '');
  }

  if (data.image) {
    formData.append('image', data.image);
  }

  return formData;
};

const createSupportWorkFormData = (data: SupportWorkPayload): FormData => {
  const formData = new FormData();

  formData.append('homePageSectionId', data.homePageSectionId);

  formData.append('order', String(data.order));

  formData.append('title', data.title);

  if (data.description !== undefined) {
    formData.append('description', data.description ?? '');
  }

  if (data.tagline !== undefined) {
    formData.append('tagline', data.tagline ?? '');
  }

  data.focus.forEach((item) => {
    formData.append('focus', item);
  });

  if (data.image) {
    formData.append('image', data.image);
  }

  return formData;
};

export const getHomePageByCampaignId = async (
  campaignId: string
): Promise<HomePageSection | null> => {
  const response = await api.get<ApiResponse<HomePageSection | null>>(
    `/protected/homepage/campaign/${campaignId}`
  );

  return response.data.data;
};

export const upsertHomePage = async (
  campaignId: string,
  data: UpsertHomePagePayload
): Promise<HomePageSection> => {
  const formData = createHomePageFormData(data);

  const response = await api.post<ApiResponse<HomePageSection>>(
    `/protected/homepage/campaign/${campaignId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data.data;
};

export const createWhySection = async (
  data: WhySectionPayload
): Promise<WhySectionPayload> => {
  const formData = createWhyFormData(data);

  const response = await api.post<ApiResponse<WhySectionPayload>>(
    `/protected/homepage/why-section`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data.data;
};

export const updateWhySection = async (
  id: string,
  data: WhySectionPayload
): Promise<WhySectionPayload> => {
  const formData = createWhyFormData(data);

  const response = await api.put<ApiResponse<WhySectionPayload>>(
    `/protected/homepage/why-section/${id}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data.data;
};

export const deleteWhySection = async (id: string): Promise<void> => {
  await api.delete(`/protected/homepage/why-section/${id}`);
};

export const createSupportWork = async (
  data: SupportWorkPayload
): Promise<SupportWorkPayload> => {
  const formData = createSupportWorkFormData(data);

  const response = await api.post<ApiResponse<SupportWorkPayload>>(
    `/protected/homepage/suppoprt-work`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data.data;
};

export const updateSupportWork = async (
  id: string,
  data: SupportWorkPayload
): Promise<SupportWorkPayload> => {
  const formData = createSupportWorkFormData(data);

  const response = await api.put<ApiResponse<SupportWorkPayload>>(
    `/protected/homepage/suppoprt-work/${id}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data.data;
};

export const deleteSupportWork = async (id: string): Promise<void> => {
  await api.delete(`/protected/homepage/suppoprt-work/${id}`);
};
