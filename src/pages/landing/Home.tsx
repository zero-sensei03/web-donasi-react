import { HomeHero } from '@/components/public/HomeHero';
import SupportCTA from '@/components/public/SupportCTA';
import { SEO } from '@/components/SEO';
import { WhySectionHome } from '@/components/public/WhySection';
import { ImpactAndDonorsSection } from '@/components/public/ImpactAndDonorsSection';
import { DonationSection } from '@/components/public/DonationSection';

import CTAHome from '@/assets/images/cta-home.webp';
import HeroImage from '@/assets/images/hero-image.webp';
import Logo from '@/assets/images/logo.webp';
import { InactiveCampaignPage } from '@/components/public/EmptyCampaign';
import { useSiteStore } from '@/stores/data-site';
import { useMemo } from 'react';

export interface CampaignProps {
  hero: {
    image: string;
    tagline: string | null;
    title: string;
    description: string | null;
    mission: string | null;
  };
  supportCta: {
    image?: string;
    title?: string | null;
    subTitle?: string | null;
    tagline?: string | null;
  };
  support: {
    tagline?: string | null;
    subTitle?: string | null;
    items: {
      id: string;
      order: number;
      title: string;
      image: string | null;

      tagline: string | null;
      description: string | null;
      focus: string[];
    }[];
  };
  why: {
    description: string;
    card: {
      icon: string;
      title: string;
      subTitle: string;
    }[];
  };
}

export default function Home() {
  const campaign = useSiteStore((state) => state.campaignData);

  if (!campaign) {
    return <InactiveCampaignPage />;
  }

  const CampaignData: CampaignProps = useMemo(() => {
    const homeData = campaign.homePageSection;
    return {
      hero: {
        image: homeData?.heroBgImage || HeroImage,
        tagline: homeData?.heroTagline || null,
        title: homeData?.heroTitle || 'Ayo Berdonasi Bersama',
        description:
          homeData?.heroDescription ||
          'Mari bersama memberikan dukungan untuk mewujudkan berbagai langkah, impian, dan kegiatan positif. Setiap donasi yang diberikan dapat menjadi bagian penting dalam membantu mereka yang membutuhkan serta mendukung terciptanya perubahan yang lebih baik.',
        mission: campaign.aboutUsSection?.vision || null,
      },
      supportCta: {
        tagline: homeData?.ctaSectionTagline || null,
        title:
          homeData?.ctaSectionTitle || 'Bersama, Wujudkan Harapan Lebih Besar!',
        subTitle:
          homeData?.ctaSectionSubtitle ||
          'Setiap dukungan yang diberikan menjadi bagian dari sebuah perjalanan menuju perubahan yang lebih baik. Bersama Anda, setiap langkah kecil dapat menjadi kekuatan untuk mewujudkan harapan, mendukung karya positif, dan menciptakan dampak yang lebih berarti.',
        image: homeData?.ctaSectionBgImage || CTAHome,
      },
      why: {
        description:
          homeData?.whyHomeDescription ||
          'Setiap dukungan, sekecil apa pun, memiliki arti dalam mewujudkan harapan dan menciptakan perubahan yang lebih baik. Bersama, kita dapat memberikan dampak nyata bagi mereka yang membutuhkan',
        card: (homeData?.whySection || []).map((item) => ({
          ...item,
          icon: item.icon || Logo,
        })),
      },
      support: {
        tagline: homeData?.supportWorkTagline || null,
        subTitle:
          homeData?.supportWorkDescription ||
          'Setiap dukungan yang diberikan akan disalurkan untuk membantu memenuhi kebutuhan dan mendukung terlaksananya kegiatan secara tepat guna, sehingga setiap kontribusi dapat memberikan manfaat dan dampak yang nyata',

        items: (homeData?.supportWorkSection || []).map((item) => ({
          ...item,
          id: item.order.toString(),
          image: item.icon || Logo,
        })),
      },
    };
  }, [campaign]);

  return (
    <>
      <SEO
        title="Home"
        description="Mari berbagi kebaikan dan berkontribusi melalui donasi untuk mendukung berbagai kegiatan dan tujuan yang berarti."
      />

      <div className="flex flex-col">
        <HomeHero CampaignData={CampaignData} />
        <WhySectionHome CampaignData={CampaignData} />
        {CampaignData.support.items.length > 0 && (
          <ImpactAndDonorsSection CampaignData={CampaignData} />
        )}
        <SupportCTA CampaignData={CampaignData} />
        <DonationSection />
      </div>
    </>
  );
}
