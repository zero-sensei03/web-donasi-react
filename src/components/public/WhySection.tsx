import type { CampaignProps } from "@/pages/landing/Home"

export const WhySectionHome = ({
  CampaignData
}: { CampaignData: CampaignProps }) => {
  return (
    <section className="py-16 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="max-w-4xl text-center mx-auto flex flex-col gap-4 mb-12">
          <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-foreground tracking-tight">
            Mengapa Dukungan Anda Penting?
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            {CampaignData.why.description}
          </p>
        </div>

        {/* Dynamic Card Container */}
        {/* Using Flexbox + justify-center for auto-centering items */}
        <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
          {CampaignData.why.card?.map((item, index) => (
            <div
              key={index}
              className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1.17rem)] flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl bg-card border border-border/60 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 group"
            >
              {/* Icon / Image Container */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 mb-5 rounded-2xl bg-primary/10 flex items-center justify-center p-3 group-hover:scale-110 transition-transform duration-300">
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Title & Subtitle */}
              <h3 className="font-semibold text-lg sm:text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {item.subTitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}