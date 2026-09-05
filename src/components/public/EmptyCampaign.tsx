export const InactiveCampaignPage = () => {
  return (
    <div className="min-h-screen bg-background text-forground flex flex-col justify-between relative overflow-hidden">
      {/* Grid Overlay Background */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" 
      />

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-16 sm:py-24 flex-1 flex flex-col items-center justify-center text-center">
        
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-atac-green-light border border-atac-green-dark text-atac-green-dark text-xs font-semibold mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-atac-green-dark animate-pulse" />
          <span>Penggalangan Dana Ditutup Sementara</span>
        </div>

        {/* Dynamic Heading with Gradient */}
        <h1 className="max-w-3xl text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-atac-green-dark via-atac-green to-navy bg-clip-text text-transparent">
          Saat Ini Belum Ada Kampanye Dukungan yang Aktif
        </h1>

      </main>
    </div>
  )
}