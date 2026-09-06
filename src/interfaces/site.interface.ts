export interface SiteResponse {
  key: string;
  value: string;
}

export type SiteSettingKey =
  | 'app.name'
  | 'app.address'
  | 'app.phone'
  | 'app.email'
  | 'app.facebook'
  | 'app.instagram'
  | 'app.twitter'
  | 'app.youtube'
  | 'app.tiktok'
  | 'app.logo';

export interface SiteSetting {
  key: SiteSettingKey | string;
  value: string;
}

export interface UpdateSiteSettingPayload {
  key: string;
  value: string;
}
