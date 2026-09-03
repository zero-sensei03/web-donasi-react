import { Link } from 'react-router-dom';
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  HeartHandshake,
} from 'lucide-react';
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';
import { Divider } from '@heroui/react';
import type { siteSettingProps } from '.';
import { NavbarLandingMenu } from '@/constants/MenuConstant';
import type { IconType } from 'react-icons';

export const FooterPublic = ({
  siteSetting,
}: {
  siteSetting: siteSettingProps;
}) => {
  const socialMedia: { icon: IconType; label: string; href: string }[] = [];

  if (siteSetting.facebook)
    socialMedia.push({
      icon: FaFacebookF,
      label: 'Facebook',
      href: siteSetting.facebook,
    });
  if (siteSetting.instagram)
    socialMedia.push({
      icon: FaInstagram,
      label: 'Instagram',
      href: siteSetting.instagram,
    });
  if (siteSetting.twitter)
    socialMedia.push({
      icon: FaXTwitter,
      label: 'Twitter',
      href: siteSetting.twitter,
    });
  if (siteSetting.youtube)
    socialMedia.push({
      icon: FaYoutube,
      label: 'Youtube',
      href: siteSetting.youtube,
    });
  if (siteSetting.tiktok)
    socialMedia.push({
      icon: FaTiktok,
      label: 'Tiktok',
      href: siteSetting.tiktok,
    });

  return (
    <footer className="bg-background text-foreground border-t border-border relative overflow-hidden">
      {/* Aksesori Dekorasi Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue/10 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

      {/* Konten Utama Footer */}
      <div className="container mx-auto px-4 pt-12 pb-8 relative z-10 flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Kolom 1: Brand & Sosial Media (5 Span) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-3 text-2xl font-bold text-foreground group"
              >
                <img
                  src={siteSetting.logo}
                  alt={siteSetting.name}
                  className="h-16"
                />
                <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  {siteSetting.name}
                </span>
              </Link>
              <p className="mt-4 text-gray-600 leading-relaxed text-sm max-w-md">
                Wadah kebaikan untuk saling berbagi dan mendukung sesama melalui
                program donasi yang transparan, terpercaya, dan berdampak nyata
                bagi mereka yang membutuhkan.
              </p>
            </div>

            {/* Media Sosial */}
            <div className="mt-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 block mb-3">
                Ikuti Media Sosial Kami
              </span>
              <div className="flex items-center gap-2.5">
                {socialMedia.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className="w-9 h-9 rounded-lg bg-atac-green-light border border-atac-green-dark flex items-center justify-center text-primary hover:text-atac-green-dark hover:border-primary hover:bg-primary/10 transition-all duration-300 hover:-translate-y-1"
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Kolom 2: Navigasi Cepat (3 Span) */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold uppercase text-foreground mb-4 flex items-center gap-2">
              Navigasi Utama
            </h4>
            <ul className="space-y-2 text-sm">
              {NavbarLandingMenu.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.url}
                    className="text-gray-600 hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight
                      size={14}
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-primary"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Kontak & CTA Donasi (4 Span) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
                Hubungi Kami
              </h4>
              <ul className="space-y-2.5 text-sm text-gray-600">
                <li className="flex items-start gap-3">
                  <MapPin
                    size={18}
                    className="text-foreground shrink-0 mt-0.5"
                  />
                  <span className="leading-snug">{siteSetting.address}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-foreground shrink-0" />
                  <span>{siteSetting.phone}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-foreground shrink-0" />
                  <span>{siteSetting.email}</span>
                </li>
              </ul>
            </div>

            {/* Card CTA Donasi Cepat menggantikan Subscription */}
            <div className="mt-8 p-4 rounded-xl bg-atac-green-light border border-atac-green-dark backdrop-blur-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Siap Berbagi Kebaikan?
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Bantu sesama hari ini.
                  </p>
                </div>
                <Link
                  to="/donation-support"
                  className="relative overflow-hidden px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-xs shadow-md transition-all duration-300 before:absolute before:inset-0 before:bg-accent before:-translate-x-full hover:before:translate-x-0 before:transition-transform before:duration-300 before:ease-in-out shrink-0"
                >
                  <span className="relative z-10 flex items-center gap-1.5 hover:text-accent-foreground transition-colors duration-300">
                    Donasi <HeartHandshake size={14} />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Divider className="border-silver" />

        {/* Garis Pemisah & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p className="flex items-center gap-1.5">
            © {new Date().getFullYear()} {siteSetting.name}. Dibuat dengan{' '}
            <Heart
              size={14}
              className="text-destructive fill-destructive animate-pulse"
            />{' '}
            untuk sesama.
          </p>

          <div className="flex items-center gap-6">
            <Link
              to="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Kebijakan Privasi
            </Link>
            <Link
              to="/terms"
              className="hover:text-foreground transition-colors"
            >
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
