export interface AboutUsSection {
  id: string;
  campaignId: string;
  heroTagline: string | null;
  heroTitle: string | null;
  heroDescription: string | null;
  heroBgImage: string | null;
  vision: string | null;
  mission: string[];
  createdAt: string;
  updatedAt: string;
  CampaignTim: CampaignTim[];
  WorkStructureDivision: WorkStructureDivision[];
}

export interface CampaignTim {
  id: string;
  aboutUsSectionId: string;
  name: string;
  position: string | null;
  image: string | null;
  instagram: string | null;
  linkedin: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkStructureDivision {
  id: string;
  aboutUsSectionId: string;
  divisionName: string;
  divisionJobDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertAboutUsPayload {
  heroTagline?: string | null;
  heroTitle?: string | null;
  heroDescription?: string | null;
  vision?: string | null;
  mission?: string[];
  image?: File;
}

export interface CampaignTimPayload {
  aboutUsSectionId: string;
  name: string;
  position?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  image?: File;
}

export interface WorkStructurePayload {
  aboutUsSectionId: string;
  divisionName: string;
  divisionJobDescription: string;
}
