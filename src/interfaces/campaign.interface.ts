export interface DonationCampaignRes {
  target: number;
  collected: number;
  donateCount: number;
  sponsor: number;
}

export interface CampaignPublicRes {
  id: string;
  name: string;

  homePageSection: {
    heroBgImage: string | null;
    heroTagline: string | null;
    heroTitle: string | null;
    heroDescription: string | null;
    whyHomeDescription: string | null;
    whySection: {
      icon: string | null;
      title: string;
      subTitle: string;
    }[];
    supportWorkTagline: string | null;
    supportWorkDescription: string | null;
    supportWorkSection: {
      order: number;
      icon: string | null;
      title: string;
      tagline: string | null;
      description: string | null;
      focus: string[];
    }[];
    ctaSectionBgImage: string | null;
    ctaSectionTagline: string | null;
    ctaSectionTitle: string | null;
    ctaSectionSubtitle: string | null;
  } | null;
  aboutUsSection: {
    heroBgImage: string | null;
    heroTagline: string | null;
    heroTitle: string | null;
    heroDescription: string | null;
    vision: string | null;
    mission: string[];
    CampaignTim: {
      image: string | null;
      name: string;
      position: string | null;
      instagram: string | null;
      linkedin: string | null;
    }[];
    WorkStructureDivision: {
      divisionName: string;
      divisionJobDescription: string;
    }[];
  } | null;
}

export type CampaignStatus = 'ACTIVE' | 'INACTIVE';

export interface Campaign {
  id: string;
  startAt: string;
  endAt: string;
  title: string;
  description: string;
  targetDonationAmount: number;
  sponsorCount: number;
  status: CampaignStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CampaignPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CampaignListResponse {
  items: Campaign[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateCampaignPayload {
  startAt: string;
  endAt: string;
  title: string;
  description: string;
  targetDonationAmount: number;
  sponsorCount: number;
}

export type UpdateCampaignPayload = CreateCampaignPayload;

export interface CampaignFormValues {
  startAt: string;
  endAt: string;
  title: string;
  description: string;
  targetDonationAmount: string;
  sponsorCount: string;
}
