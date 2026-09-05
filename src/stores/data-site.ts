// src/store/site.ts

import type { CampaignPublicRes } from "@/interfaces/campaign.interface";
import type { SiteResponse } from "@/interfaces/site.interface";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type SiteData = Record<string, string>;

type SiteState = {
  siteData: SiteData;
  campaignData: CampaignPublicRes | null;

  setSiteData: (data: SiteResponse[]) => void;
  setCampaignData: (data: CampaignPublicRes | null) => void;

  removeSiteData: () => void;
  removeCampaignData: () => void;
};

export const useSiteStore = create<SiteState>()(
  persist(
    (set) => ({
      siteData: {},
      campaignData: null,

      setSiteData: (data) =>
        set({
          siteData: Object.fromEntries(
            data.map((item) => [item.key.replace(".", "_"), item.value])
          ),
        }),

      setCampaignData: (data) =>
        set({
          campaignData: data,
        }),

      removeSiteData: () =>
        set({
          siteData: {},
        }),

      removeCampaignData: () =>
        set({
          campaignData: null,
        }),
    }),
    {
      name: "web-donasi-site",

      partialize: (state) => ({
        siteData: state.siteData,
      }),
    }
  )
);