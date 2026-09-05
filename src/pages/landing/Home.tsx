import { HomeHero } from '@/components/public/HomeHero';
import SupportCTA from '@/components/public/SupportCTA';
import { SEO } from '@/components/SEO';
import { WhySectionHome } from '@/components/public/WhySection';
import { ImpactAndDonorsSection } from '@/components/public/ImpactAndDonorsSection';
import { DonationSection } from '@/components/public/DonationSection';

import DummyHero from '@/assets/images/dummy-hero.webp';
import Logo from '@/assets/images/dummy-logo.png';
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

  if(!campaign) {
    return <InactiveCampaignPage />
  }

  const CampaignData: CampaignProps = useMemo(() => {
    const homeData = campaign.homePageSection;
    return {
      hero: {
        image: DummyHero,
        tagline: homeData?.heroTagline || null,
        title: homeData?.heroTitle || "Ayo Berdonasi Bersama",
        description: homeData?.heroDescription || "Mari bersama memberikan dukungan untuk mewujudkan berbagai langkah, impian, dan kegiatan positif. Setiap donasi yang diberikan dapat menjadi bagian penting dalam membantu mereka yang membutuhkan serta mendukung terciptanya perubahan yang lebih baik.",
        mission: campaign.aboutUsSection?.vision || null,
      },
      supportCta: {
        tagline: homeData?.ctaSectionTagline || null,
        title: homeData?.ctaSectionTitle || 'Bersama, Wujudkan Harapan Lebih Besar!',
        subTitle: homeData?.ctaSectionSubtitle || "Setiap dukungan yang diberikan menjadi bagian dari sebuah perjalanan menuju perubahan yang lebih baik. Bersama Anda, setiap langkah kecil dapat menjadi kekuatan untuk mewujudkan harapan, mendukung karya positif, dan menciptakan dampak yang lebih berarti.",
        image: DummyHero,
      },
      why: {
        description: homeData?.whyHomeDescription || "Setiap dukungan, sekecil apa pun, memiliki arti dalam mewujudkan harapan dan menciptakan perubahan yang lebih baik. Bersama, kita dapat memberikan dampak nyata bagi mereka yang membutuhkan",
        card: [
          {
            icon: Logo,
            title: 'Pengembangan Pesawat',
            subTitle: 'Meningkatkan performa dan inovasi pesawat kami',
          },
          {
            icon: Logo,
            title: 'Pengembangan Pesawat',
            subTitle: 'Meningkatkan performa dan inovasi pesawat kami',
          },
          {
            icon: Logo,
            title: 'Pengembangan Pesawat',
            subTitle: 'Meningkatkan performa dan inovasi pesawat kami',
          },
        ],
      },
      support: {
        tagline: homeData?.supportWorkTagline || null,
        subTitle: homeData?.supportWorkDescription || "Setiap dukungan yang diberikan akan disalurkan untuk membantu memenuhi kebutuhan dan mendukung terlaksananya kegiatan secara tepat guna, sehingga setiap kontribusi dapat memberikan manfaat dan dampak yang nyata",
  
        items: [
          {
            id: '1',
            order: 1,
            image: Logo,
            title: 'Akomodasi & Transportasi',
            tagline: 'Kebutuhan Perjalanan Tim',
            description:
              'Dukungan Anda memastikan seluruh anggota tim dapat berangkat tepat waktu, memiliki tempat tinggal yang aman, dan fokus penuh pada persiapan teknis di lokasi lomba.',
            focus: [
              'Tiket keberangkatan & kepulangan tim',
              'Penginapan dekat lokasi kompetisi',
              'Mobilitas operasional tim selama di lokasi',
            ],
          },
          {
            id: '2',
            order: 2,
            title: 'Registrasi & Kebutuhan Teknis',
            tagline: 'Kesiapan Berkompetisi',
            description:
              'Mencakup seluruh biaya administrasi resmi pendaftaran serta kelengkapan perangkat keras dan lunak pendukung karya yang akan dilombakan.',
            image: Logo,
            focus: [
              'Biaya pendaftaran resmi kompetisi',
              'Lisensi lunak & riset pendukung',
              'Pengujian alat & lisensi karya',
            ],
          },
          {
            id: '3',
            order: 3,
            title: 'Logistik & Operasional Lapangan',
            tagline: 'Kesehatan & Karantina',
            description:
              'Menjaga kondisi fisik dan mental tim agar tetap dalam performa terbaik selama masa penyisihan hingga babak final.',
            image: Logo,
            focus: [
              'Konsumsi & nutrisi tim harian',
              'Perlengkapan medis & dana darurat',
              'Kebutuhan operasional kontingensi',
            ],
          },
        ],
      },
    }
  }, [campaign])

  return (
    <>
      <SEO title="Home" description="Mari berbagi kebaikan dan berkontribusi melalui donasi untuk mendukung berbagai kegiatan dan tujuan yang berarti." />

      <div className="flex flex-col">
        <HomeHero CampaignData={CampaignData} />
        <WhySectionHome CampaignData={CampaignData} />
        <ImpactAndDonorsSection CampaignData={CampaignData} />
        <SupportCTA CampaignData={CampaignData} />
        <DonationSection />
      </div>
    </>
  )
}
