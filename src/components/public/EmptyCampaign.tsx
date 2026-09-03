import { 
  Radio, 
  Sparkles, 
  Calendar,
} from "lucide-react"

export const InactiveCampaignPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background Decorator / Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Overlay Background */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" 
      />

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-16 sm:py-24 flex-1 flex flex-col items-center justify-center text-center">
        
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-semibold mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Penggalangan Dana Ditutup Sementara</span>
        </div>

        {/* Dynamic Heading with Gradient */}
        <h1 className="max-w-3xl text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Saat Ini Belum Ada Kampanye Dukungan yang Aktif
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-xl text-sm sm:text-base text-slate-400 leading-relaxed">
          Tim ATAC saat ini sedang fokus pada tahap persiapan internal dan riset teknis. Terima kasih atas antusiasme dan dukungan luar biasa yang telah Anda berikan!
        </p>

        {/* Highlight Cards / Next Steps */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl text-left">
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
              <Radio className="size-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Riset & Pengembangan</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tim mekanik dan avionik sedang mematangkan performa wahana UAV.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
              <Calendar className="size-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Jadwal Mendatang</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kampanye baru diproyeksikan akan dibuka mendekati tanggal seleksi.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
              <Sparkles className="size-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Kemitraan & Sponsor</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Terbuka untuk kolaborasi institusi dan sponsorship resmi.
            </p>
          </div>
        </div>

      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 border-t border-slate-900 py-6 text-center text-xs text-slate-600">
        <p>© {new Date().getFullYear()} Tim ATAC — Universitas Dirgantara Marsekal Suryadarma.</p>
      </footer>
    </div>
  )
}