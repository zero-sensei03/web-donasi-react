import { HomeHero } from '@/components/public/HomeHero';
import SupportCTA from '@/components/public/SupportCTA';
import { SEO } from '@/components/SEO';
import { WhySectionHome } from '@/components/public/WhySection';
import { ImpactAndDonorsSection } from '@/components/public/ImpactAndDonorsSection';
import { DonationSection } from '@/components/public/DonationSection';

import DummyHero from '@/assets/images/dummy-hero.webp';
import Logo from '@/assets/images/dummy-logo.png';
import { InactiveCampaignPage } from '@/components/public/EmptyCampaign';

export interface CampaignProps {
  hero: {
    image: string;
    tagline: string | null;
    title: string;
    description: string | null;
    mission: string | null;
  };
  donationProgress: {
    amount: number;
    target: number;
    donaturCount: number;
    sponsorCount: number;
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
  donations: {
    id: string;
    name: string | null;
    message: string | null;
    amount: number;
    timestamp: string;
  }[];
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
  const CampaignData: CampaignProps | null = {
    hero: {
      image: DummyHero,
      tagline: 'ATAC Goes to KRTI IKN 2026',
      title: 'Bersama ATAC Menuju Kontes Robot Terbang Indonesia IKN',
      description:
        'Dukung perjuangan mahasiswa Universitas Dirgantara Marsekal Suryadarma dalam membawa inovasi teknologi kedirgantaraan terbaik ke ajang bergengsi nasional di Ibu Kota Nusantara.',
      mission:
        'Mengembangkan teknologi UAV otonom terbaik untuk membawa nama almamater dan berkontribusi bagi riset kedirgantaraan Indonesia.',
    },
    donationProgress: {
      amount: 63250000,
      target: 100000000,
      donaturCount: 128,
      sponsorCount: 37,
    },
    supportCta: {
      tagline: 'Dukung Perjalanan ATAC',
      title: 'Bantu Kami Terbang Lebih Tinggi!',
      subTitle:
        'Setiap dukungan yang diberikan menjadi bagian dari perjalanan kami menuju KRTI IKN. Bersama Anda, kami ingin membawa karya, inovasi, dan nama ATAC terbang lebih jauh.',
      image: DummyHero,
    },
    why: {
      description:
        'Kami adalah tim mahasiswa yang berjuang mengharumkan nama kampus di ajang nasional. Setiap dukungan Anda, sekecil apapun akan menjadi bahan bakar kami untuk terbang lebih tinggi',
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
      tagline: 'Persiapan Lomba',
      subTitle:
        'Setiap bentuk dukungan disalurkan secara langsung untuk memenuhi kebutuhan esensial keberangkatan dan kompetisi tim ATAC.',

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
    donations: [
      {
        id: '1',
        name: 'Muhammad Rafli',
        amount: 250000,
        timestamp: '5 menit lalu',
        message: 'Semangat tim ATAC! Harumkan nama kampus!',
      },
      {
        id: '2',
        name: 'Anisa Pertiwi',
        amount: 500000,
        timestamp: '12 menit lalu',
        message: 'Bisa yuk bawa pulang piala juara 1! 🏆',
      },
      {
        id: '3',
        name: 'Budi Santoso',
        amount: 100000,
        timestamp: '1 jam lalu',
        message: 'Bismillah, lancar perlombaannya.',
      },
      {
        id: '4',
        name: 'Siti Rahmawati',
        amount: 1000000,
        timestamp: '2 jam lalu',
        message: 'Dukungan penuh untuk karya anak bangsa.',
      },
      {
        id: '5',
        name: 'Dimas Anggara',
        amount: 50000,
        timestamp: '3 jam lalu',
        message: 'Sukses selalu temen-temen!',
      },
      {
        id: '6',
        name: 'Hamba Allah',
        amount: 300000,
        timestamp: '5 jam lalu',
        message: 'Semoga berkah dan menang!',
      },
    ],
  };

  return CampaignData ? (
    <>
      <SEO title={'Home'} description={'Home'} />

      <div className="flex flex-col">
        <HomeHero CampaignData={CampaignData} />
        <WhySectionHome CampaignData={CampaignData} />
        <ImpactAndDonorsSection CampaignData={CampaignData} />
        <SupportCTA CampaignData={CampaignData} />
        <DonationSection CampaignData={CampaignData} />
      </div>
    </>
  ) : (
    <>
      <InactiveCampaignPage />
    </>
  );
}
