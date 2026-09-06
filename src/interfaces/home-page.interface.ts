export interface HomePageSection {
  id: string;
  campaignId: string;

  heroTagline: string | null;
  heroTitle: string | null;
  heroDescription: string | null;
  heroBgImage: string | null;

  whyHomeDescription: string | null;

  supportWorkTagline: string | null;
  supportWorkDescription: string | null;

  ctaSectionTagline: string | null;
  ctaSectionTitle: string | null;
  ctaSectionSubtitle: string | null;
  ctaSectionBgImage: string | null;

  createdAt: string;
  updatedAt: string;

  whySection: WhySection[];
  supportWorkSection: SupportWorkSection[];
}

export interface WhySection {
  id: string;
  homePageSectionId: string;
  icon: string | null;
  title: string;
  subTitle: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SupportWorkSection {
  id: string;
  homePageSectionId: string;
  order: number;
  title: string;
  description: string | null;
  tagline: string | null;
  focus: string[];
  icon: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertHomePagePayload {
  heroTagline?: string | null;
  heroTitle?: string | null;
  heroDescription?: string | null;

  whyHomeDescription?: string | null;

  supportWorkTagline?: string | null;
  supportWorkDescription?: string | null;

  ctaSectionTagline?: string | null;
  ctaSectionTitle?: string | null;
  ctaSectionSubtitle?: string | null;

  heroImage?: File;
  ctaImage?: File;
}

export interface WhySectionPayload {
  homePageSectionId: string;
  icon?: string | null;
  title: string;
  subTitle?: string | null;
  image?: File;
}

export interface SupportWorkPayload {
  homePageSectionId: string;
  order: number;
  title: string;
  description?: string | null;
  tagline?: string | null;
  focus: string[];
  image?: File;
}
