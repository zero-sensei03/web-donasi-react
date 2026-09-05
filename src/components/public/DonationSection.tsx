import { useMemo } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import { Heart, Clock, ShieldAlert } from "lucide-react"
import { useGetDonationPublic } from "@/services/donation"
import { useSiteStore } from "@/stores/data-site"

import "swiper/css"

export const DonationSection = () => {
  const campaign = useSiteStore((state) => state.campaignData);
  const { data } = useGetDonationPublic(campaign?.id || "")
  const DONATION_FETCH = useMemo(() => {
    return data?.data || []
  }, [data])
  return DONATION_FETCH.length > 0 ? (
    <section className="w-full">
      <div className="bg-white text-foreground py-16 border-t border-border/40">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Donatur Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                <Heart size={20} className="fill-primary text-primary animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-foreground">
                    Dukungan Terbaru
                  </h3>
                  <span className="inline-flex items-center gap-2 text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Live
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Terima kasih atas kepedulian Anda mendukung kami.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground bg-card px-3 py-1.5 rounded-lg border border-border/60">
              <ShieldAlert size={14} className="text-primary" />
              <span>Privasi nama terproteksi otomatis</span>
            </div>
          </div>

          {/* Slider Donatur dengan Card yang Lebih Menarik */}
          <Swiper
            modules={[Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
            className="w-full"
          >
            {DONATION_FETCH.map((donor, idx) => (
              <SwiperSlide key={idx}>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-background to-card border border-border/60 hover:border-primary/40 transition-all flex flex-col justify-between gap-3 h-full shadow-sm group">
                  <div>
                    {/* Header Card Donatur */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-primary/20">
                          {(donor.donorName)[0]}
                        </div>
                        <p className="font-semibold text-xs text-foreground truncate">
                          {donor.donorName}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-primary shrink-0 bg-primary/5 px-2.5 py-1 rounded-md border border-primary/10">
                        IDR {donor.amount.toLocaleString("id-ID")}
                      </span>
                    </div>

                    {/* Pesan / Doa Donatur (Jika ada) */}
                    <p className="text-xs text-atac-green italic line-clamp-2 leading-relaxed bg-atac-green-light/40 p-2.5 rounded-xl border border-border/30">
                      "{donor.message || "-"}"
                    </p>
                  </div>

                  {/* Waktu Donasi */}
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground pt-1 border-t border-border/30">
                    <Clock size={12} />
                    <span>{donor.createdAt}</span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

        </div>
      </div>
    </section>
  ) : null
}