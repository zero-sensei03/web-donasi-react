import { useState } from "react"
import { ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react"
import type { CampaignProps } from "@/pages/landing/Home"

export const ImpactAndDonorsSection = ({ CampaignData }: { CampaignData: CampaignProps }) => {
  const [activePrep, setActivePrep] = useState(CampaignData.support.items[0].id)
  const currentPrep = CampaignData.support.items.find((p) => p.id === activePrep) || CampaignData.support.items[0]

  return (
    <section className="w-full">
      {/* ================= 1. SECTION PERSIAPAN LOMBA (WHITE BACKGROUND) ================= */}
      <div className="bg-white text-slate-900 py-20 border-t border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue/10 rounded-full blur-3xl pointer-events-none translate-y-1/2" />
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Header Section */}
          <div className="max-w-2xl mb-12">
            <div className="flex">
              <span className="text-xs font-bold tracking-wider uppercase text-primary bg-atac-green-light block mb-2 py-1 px-2.5 rounded-full">
                Persiapan Lomba
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Bagaimana Dukungan Anda Bekerja
            </h2>
            <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
              Setiap bentuk dukungan disalurkan secara langsung untuk memenuhi kebutuhan esensial keberangkatan dan kompetisi tim ATAC.
            </p>
          </div>

          {/* Interactive Stage & Detail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* List Stage Selector (Kiri) */}
            <div className="lg:col-span-5 space-y-3">
              {CampaignData.support.items.map((item) => {
                const isActive = item.id === activePrep
                return (
                  <div
                    key={item.id}
                    onClick={() => setActivePrep(item.id)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center gap-4 ${
                      isActive
                        ? "bg-slate-50 border-atac-green shadow-sm"
                        : "bg-white border-border hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isActive ? "bg-atac-green-light text-atac-green-dark" : "bg-gray-400/20 text-gray-600"
                    }`}>
                      {item.image ? <img src={item.image} alt={item.title} className="h-8 w-8" /> : <ShieldCheck size={20} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                        Tahap {item.order.toString().padStart(2, "0")}
                      </span>
                      <h3 className="text-sm font-semibold text-foreground truncate">
                        {item.title}
                      </h3>
                    </div>

                    <ArrowRight size={16} className={`transition-transform ${isActive ? "text-atac-green-dark translate-x-1" : "text-gray-400"}`} />
                  </div>
                )
              })}
            </div>

            {/* Display Card Detail (Kanan) */}
            <div className="lg:col-span-7 bg-slate-50 border border-border rounded-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[330px]">
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  {currentPrep.tagline ? (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-atac-green-light text-atac-green-dark border border-atac-green">
                      {currentPrep.tagline}
                    </span>
                  ) : null}
                  <span className="text-xs text-muted-foreground font-mono">
                    Tahap {currentPrep.order.toString().padStart(2, "0")}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3">
                  {currentPrep.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {currentPrep.description}
                </p>

                {/* List Poin Kebutuhan */}
                <div className="space-y-2.5 pt-4 border-t border-border">
                  <span className="text-xs font-semibold text-slate-900 block mb-2">
                    Fokus Penggunaan Utama:
                  </span>
                  {currentPrep.focus.map((point, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-600">
                      <CheckCircle2 size={15} className="text-primary shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}