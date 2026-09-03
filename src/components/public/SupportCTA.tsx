import type { CampaignProps } from "@/pages/landing/Home";
import { ArrowRight, HeartHandshake } from "lucide-react";
import { Link } from "react-router-dom";

export default function SupportCTA({
    CampaignData
}: { CampaignData: CampaignProps }) {
  return (
    <section className="relative overflow-hidden bg-[var(--navy)]">
      <div className="relative mx-auto min-h-[420px] max-w-[100rem]">
        {/* ================================
            IMAGE
            ================================ */}
        <div className="absolute inset-y-0 right-0 w-full sm:w-[65%] lg:w-[55%]">
          <img
            src={CampaignData.supportCta.image}
            alt="Tim ATAC"
            className="h-full w-full object-cover object-right"
          />

          {/* Gradient untuk menyatukan gambar dengan background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy)] via-[var(--navy)]/75 to-transparent" />

          {/* Mobile gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/80 via-transparent to-transparent sm:hidden" />
        </div>

        {/* ================================
            CONTENT
            ================================ */}
        <div className="relative z-10 flex min-h-[420px] items-center px-5 py-16 sm:px-8 lg:px-10">
          <div className="max-w-2xl">
            {/* Badge */}
            {CampaignData.supportCta.tagline ? (
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-atac-green/30 bg-atac-green/10 px-4 py-2 text-sm font-medium text-atac-green-light">
                <HeartHandshake size={16} />
                {CampaignData.supportCta.tagline}
              </div>
            ) : null}

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
              {CampaignData.supportCta.title}
            </h2>

            {/* Description */}
            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
              {CampaignData.supportCta.subTitle}
            </p>

            {/* CTA */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to={"/donation-support"}
                className="h-12 bg-primary hover:bg-atac-green-dark duration-300 px-7 font-semibold text-white flex items-center justify-center gap-2 rounded-lg"
              >
                Dukung Sekarang <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
