import { useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { NavbarPublic } from './Navbar';
import { FooterPublic } from './Footer';
import Logo from '@/assets/images/logo.webp';
import { X, ExternalLink, MessageCircleCheck } from 'lucide-react';
import { ScrollToTop } from '@/components/ScrollToTop';
import { useSiteStore } from '@/stores/data-site';
import { useGetContactListPublic } from '@/services/contact-list';

export interface siteSettingProps {
  logo: string;
  name: string;
  address: string;
  phone: string;
  email: string;

  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  youtube: string | null;
  tiktok: string | null;
}

// Inline SVG Icon untuk WhatsApp & Telegram
const WhatsAppIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

const TelegramIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

// List Kontak CS / Tim
const CONTACT_LIST = [
  {
    id: '1',
    name: 'CS Support (Sponsor & General)',
    role: 'Respons Cepat (09.00 - 18.00)',
    type: 'whatsapp',
    phone: '6281234567890',
    message: 'Halo, saya ingin bertanya seputar dukungan kampanye Tim ATAC...',
    icon: WhatsAppIcon,
    badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
  {
    id: '2',
    name: 'Humas & Media ATAC',
    role: 'Pertanyaan Konfirmasi & Media',
    type: 'whatsapp',
    phone: '6289876543210',
    message: 'Halo Humas ATAC, saya ingin mengonfirmasi donasi/sponsorship...',
    icon: WhatsAppIcon,
    badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
  {
    id: '3',
    name: 'Komunitas Telegram',
    role: 'Diskusi & Update Perkembangan',
    type: 'telegram',
    username: 'ATAC_Unsurya_Bot',
    icon: TelegramIcon,
    badgeColor: 'bg-sky-50 text-sky-600 border-sky-200',
  },
];

export const LayoutPublic = () => {
  const siteData = useSiteStore((state) => state.siteData);
  const campaignData = useSiteStore((state) => state.campaignData);

  const [isOpen, setIsOpen] = useState(false);

  const siteSetting: siteSettingProps = {
    logo: siteData.app_logo || Logo,
    name: siteData.app_name || 'Ayo Berdonasi',

    address: siteData.app_address || '-',
    phone: siteData.app_phone || '-',
    email: siteData.app_email || '-',

    facebook: siteData.app_facebook || null,
    instagram: siteData.app_instagram || null,
    twitter: siteData.app_twitter || null,
    youtube: siteData.app_youtube || null,
    tiktok: siteData.app_tiktok || null,
  };

  const { data: dataContact } = useGetContactListPublic(
    campaignData?.id || null
  );
  const CONTACT_LIST_FETCH = useMemo(() => {
    return (dataContact?.data || []).map((item) => ({
      id: item.id,
      name: item.name,
      role: item.role,
      type: item.type,
      username: item.phone,
      icon: item.type === 'TELEGRAM' ? TelegramIcon : WhatsAppIcon,
      badgeColor:
        item.type === 'TELEGRAM'
          ? 'bg-sky-50 text-sky-600 border-sky-200'
          : 'bg-emerald-50 text-emerald-600 border-emerald-200',
    }));
  }, [dataContact]);

  // Handler Kirim Chat
  const handleContactClick = (item: (typeof CONTACT_LIST)[0]) => {
    let url = '';

    if (item.type === 'WHATSAPP') {
      url = `https://wa.me/${item.username}`;
    } else if (item.type === 'TELEGRAM') {
      url = `https://t.me/${item.username}`;
    }

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      <ScrollToTop />

      {/* Header & Page Contents */}
      <div>
        <NavbarPublic siteSetting={siteSetting} />
        <main>
          <Outlet />
        </main>
      </div>

      <FooterPublic siteSetting={siteSetting} />

      {/* ================= FLOATING CONTACT WIDGET ================= */}
      {/* pointer-events-none pada container utama agar area kosong tidak memblokir tombol lain */}
      {CONTACT_LIST_FETCH.length > 0 ? (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
          {/* DROPDOWN MENU / POPUP LIST */}
          <div
            className={`mb-4 w-72 sm:w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden transition-all duration-300 transform origin-bottom-right ${
              isOpen
                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto block'
                : 'opacity-0 scale-95 translate-y-4 pointer-events-none hidden'
            }`}
          >
            {/* Header Pop-up */}
            <div className="bg-slate-900 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <h4 className="text-sm font-bold">Hubungi Tim Kami</h4>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                Silakan pilih saluran komunikasi yang tersedia di bawah ini.
              </p>
            </div>

            {/* List Of Contacts */}
            <div className="p-3 space-y-2 max-h-[320px] overflow-y-auto bg-slate-50/50">
              {CONTACT_LIST_FETCH.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleContactClick(item)}
                    className="w-full text-left p-3 rounded-xl bg-white border border-slate-200/80 hover:border-blue-500 hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.badgeColor} shrink-0`}
                      >
                        <Icon />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {item.name}
                        </h5>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {item.role}
                        </p>
                      </div>
                    </div>

                    <ExternalLink
                      size={14}
                      className="text-slate-400 group-hover:text-blue-600 transition-colors shrink-0"
                    />
                  </button>
                );
              })}
            </div>

            {/* Footer Pop-up */}
            <div className="p-2.5 bg-white border-t border-slate-100 text-center">
              <span className="text-[10px] text-slate-400">
                Tim Kami Siap Membantu
              </span>
            </div>
          </div>

          {/* MAIN BUBBLE BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`pointer-events-auto cursor-pointer relative group flex items-center justify-center w-14 h-14 rounded-full text-white shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ${
              isOpen
                ? 'bg-slate-900 rotate-90'
                : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
            aria-label="Hubungi Kami"
          >
            {isOpen ? (
              <X size={26} />
            ) : (
              <>
                <MessageCircleCheck />
                {/* Indicator Dot */}
                <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
                </span>
              </>
            )}
          </button>
        </div>
      ) : null}
    </div>
  );
};
