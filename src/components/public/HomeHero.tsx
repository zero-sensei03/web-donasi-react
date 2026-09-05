import { Progress, Skeleton } from "@heroui/react";
import {
  ArrowRight,
  FileText,
  HeartHandshake,
  Plane,
  Users,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import type { CampaignProps } from "@/pages/landing/Home";
import { Link } from "react-router-dom";
import { useGetCampaignDonationPublic } from "@/services/campaign";
import { useSiteStore } from "@/stores/data-site";
import { useMemo } from "react";

export const HomeHero = ({ CampaignData }: { CampaignData: CampaignProps }) => {
  const campaign = useSiteStore((state) => state.campaignData);
  const { data: dataDonation, isLoading: isLoadingDonation } = useGetCampaignDonationPublic(campaign?.id || null);

  const donationStats = useMemo(() => {
    const target = dataDonation?.data.target || 1;
    const collected = dataDonation?.data.collected || 0;
    const percentage = Math.round((collected / target) * 100);
    const sponsor = dataDonation?.data.sponsor || 0;
    const donaturTotal = dataDonation?.data.donateCount || 0;

    return {
      target,
      collected,
      percentage,
      stats: [
        {
          label: "Total Donasi",
          value: `Rp ${collected.toLocaleString("id-ID")}`,
          icon: HeartHandshake,
        },
        {
          label: "Donatur",
          value: donaturTotal.toLocaleString("id-ID"),
          icon: Users,
        },
        {
          label: "Sponsor",
          value: sponsor.toLocaleString("id-ID"),
          icon: Plane,
        },
      ]
    }
  }, [dataDonation])

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <>
      <section className="relative overflow-hidden bg-[var(--navy)] text-white pb-28">
        {/* Background Image dengan Dark Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 transition-scale duration-700 hover:scale-105"
          style={{
            backgroundImage: `url(${CampaignData.hero.image})`,
          }}
        />

        {/* Layer Overlay Gradient Halus */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy)] via-[var(--navy)]/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--navy)] to-transparent" />

        {/* Glow Ornaments */}
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-[var(--primary)]/20 blur-3xl pointer-events-none" />

        {/* Content Area */}
        <div className="relative mx-auto max-w-7xl px-5 pt-28 sm:px-8 sm:pt-36 lg:px-10 lg:pt-40">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Sisi Kiri: Text & Action */}
            <div className="lg:col-span-7">
              {/* Eyebrow Badge */}
              {CampaignData.hero.tagline ? (
                <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-white backdrop-blur-md shadow-inner">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--atac-green)] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--atac-green)]" />
                  </span>
                  <span>{CampaignData.hero.tagline}</span>
                </div>
              ) : null}

              {/* Gradient Heading (Tanpa Tag Span) */}
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl bg-gradient-to-r from-white via-white to-[var(--atac-green)] bg-clip-text text-transparent">
                {CampaignData.hero.title}
              </h1>

              {/* Description */}
              <p className="mt-6 max-w-xl text-sm sm:text-base leading-relaxed text-slate-300">
                {CampaignData.hero.description}
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
                <Link
                  to={"/donation-support"}
                  className="h-12 bg-primary hover:bg-atac-green-dark duration-300 px-7 font-semibold text-white flex items-center justify-center gap-2 rounded-lg"
                >
                  Dukung Sekarang <ArrowRight size={18} />
                </Link>
                <Link
                  to={"/proposal"}
                  className="h-12 border border-white/20 bg-white/10 hover:bg-white/20 duration-300 backdrop-blur-md px-7 font-semibold text-white flex items-center justify-center gap-2 rounded-lg"
                >
                  <FileText size={18} /> Lihat Proposal
                </Link>
              </div>

              {/* Micro Highlights */}
              <div className="mt-10 flex items-center gap-6 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[var(--atac-green)]" />
                  <span>Transparan 100%</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[var(--atac-green)]" />
                  <span>Laporan Real-time</span>
                </div>
              </div>
            </div>

            {/* Sisi Kanan: Quick Highlight Badge / Graphic */}
            {CampaignData.hero.mission ? (
              <div className="hidden lg:col-span-5 lg:flex lg:justify-end">
                <div className="relative rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-md max-w-sm shadow-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/20 text-[var(--atac-green)]">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Misi Kami</h4>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    "{CampaignData.hero.mission}"
                  </p>
                </div>
              </div>
            ) : null}

          </div>
        </div>

        {/* Floating Progress Card */}

      </section>
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 -mt-16">
        <div
          className="border border-atac-green-light bg-card/95 backdrop-blur-md rounded-xl shadow-md"
        >
          {isLoadingDonation ? (
            <Skeleton className="h-20 md:min-w-xl w-full rounded-md" />
          ) : (
            <div className="p-6 sm:p-8">
              <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                
                {/* Progress Bar Info */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Progress Pengumpulan Dana
                      </span>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                          {formatRupiah(donationStats.collected)}
                        </span>
                        <span className="text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
                          {donationStats.percentage}%
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Target:{" "}
                      <span className="font-bold text-foreground">
                        {formatRupiah(donationStats.target)}
                      </span>
                    </p>
                  </div>

                  <Progress
                    aria-label="Progress dukungan"
                    value={donationStats.percentage}
                    className="h-3"
                    classNames={{
                      track: "bg-atac-green-light rounded-full",
                      indicator: "bg-gradient-to-r from-atac-green-dark to-atac-green rounded-full",
                    }}
                  />
                </div>

                {/* Stats Counters */}
                <div className="lg:col-span-5 grid grid-cols-3 divide-x divide-border border-t border-border pt-6 lg:border-t-0 lg:pt-0">
                  {donationStats.stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                      <div
                        key={stat.label}
                        className="flex flex-col items-center px-2 text-center"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
                          <Icon size={18} />
                        </div>

                        <p className="text-base sm:text-lg font-bold text-foreground">
                          {stat.value}
                        </p>

                        <p className="text-[11px] sm:text-xs text-muted-foreground font-medium">
                          {stat.label}
                        </p>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};