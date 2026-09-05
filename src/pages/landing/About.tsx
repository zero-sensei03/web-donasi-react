import { Card, CardBody, Avatar, Chip, Button } from '@heroui/react';
import {
  Target,
  Compass,
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FaInstagram, FaLinkedin } from 'react-icons/fa6';
import { SEO } from '@/components/SEO';
import { useSiteStore } from '@/stores/data-site';
import { InactiveCampaignPage } from '@/components/public/EmptyCampaign';
import { useMemo } from 'react';
import HeroAbout from "@/assets/images/hero-about.webp";

// ==========================================
// KONSTANTA DATA (Simulasi Data dari Backend)
// ==========================================

export default function AboutUsPage() {
  const navigate = useNavigate();

  const campaign = useSiteStore((state) => state.campaignData);
  if(!campaign) {
    return <InactiveCampaignPage />
  }

  const data = useMemo(() => {
    const aboutData = campaign.aboutUsSection;
    return {
      title: aboutData?.heroTitle || 'Tentang Kami',
      description: aboutData?.heroDescription || "Kami hadir untuk mendukung berbagai inisiatif, kegiatan, dan perjuangan positif melalui dukungan bersama. Setiap kontribusi menjadi bagian dari langkah nyata untuk mewujudkan harapan, mengembangkan potensi, dan menciptakan dampak yang lebih berarti bagi banyak orang",
      tagline: aboutData?.heroTagline || null,
      heroImage: aboutData?.heroBgImage || HeroAbout,

      // 5. Vision
      vision: aboutData?.vision || 'Menjadi wadah donasi yang terpercaya dan mudah diakses untuk menghubungkan kebaikan dengan mereka yang membutuhkan, serta mendorong terciptanya perubahan positif yang berkelanjutan.',

      // 6. Mission
      mission: aboutData?.mission && aboutData.mission.length > 0 ? aboutData.mission : [
        'Memudahkan setiap orang untuk berbagi dan memberikan dukungan kepada berbagai inisiatif yang membutuhkan.',
        'Membangun budaya kepedulian, gotong royong, dan semangat berbagi di tengah masyarakat.',
        'Menyalurkan dukungan secara transparan dan tepat guna agar memberikan manfaat serta dampak yang nyata.',
      ],

      // 7. Our Team
      team: aboutData?.CampaignTim || [],
      divisions: aboutData?.WorkStructureDivision || [],
    }
  }, [campaign])

  return (
    <>
      <SEO title="Tentang Kami" description="Kenali kami lebih dekat dan temukan bagaimana dukungan serta donasi dapat membantu mewujudkan berbagai kegiatan dan tujuan sosial." />
      <div className="w-full bg-white text-foreground min-h-screen">
        <section className="relative pt-28 pb-16 lg:pt-40 lg:pb-24 overflow-hidden shadow-sm">
          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Content */}
              <div className="lg:col-span-7 space-y-6">
                {data.tagline ? (
                  <Chip
                    variant="flat"
                    className="bg-atac-green/10 text-atac-green border border-atac-green/20 font-semibold text-xs px-3 py-1"
                    startContent={<Sparkles size={14} />}
                  >
                    {data.tagline}
                  </Chip>
                ) : null}

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-foreground to-atac-green bg-clip-text text-transparent">
                  {data.title}
                </h1>

                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl">
                  {data.description}
                </p>

                <div className="pt-2 flex flex-wrap gap-4">
                  <Button
                    className="bg-atac-green text-white font-bold px-6 h-12 rounded-xl shadow-lg shadow-atac-green/20 hover:bg-atac-green-dark duration-300 transition-all"
                    endContent={<ArrowUpRight size={18} />}
                    onPress={() => navigate('/donation-support')}
                  >
                    Dukung Kami
                  </Button>
                </div>
              </div>

              {/* Right Image */}
              <div className="lg:col-span-5">
                <div className="relative group">
                  <div className="relative rounded-2xl overflow-hidden shadow-md shadow-atac-green-light">
                    <img
                      src={data.heroImage}
                      alt={data.title}
                      className="w-full h-[340px] sm:h-[360px] object-cover object-center transform group-hover:scale-105 transition duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24 bg-background shadow-sm">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Vision Card */}
              <div className="lg:col-span-5">
                <Card className="h-full bg-navy-card text-white border-0 shadow-lg p-6 sm:p-8 flex flex-col justify-between">
                  <CardBody className="p-0 space-y-6">
                    <div className="w-12 h-12 rounded-2xl bg-blue-light border border-navy flex items-center justify-center text-navy">
                      <Compass size={28} />
                    </div>
                    <div>
                      <span className="text-xs font-bold tracking-widest text-blue-light uppercase block mb-1">
                        Arah & Tujuan
                      </span>
                      <h2 className="text-2xl font-bold text-white mb-3">
                        Visi Tim
                      </h2>
                      <p className="text-sm text-slate-300 leading-relaxed font-light">
                        "{data.vision}"
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Mission Card */}
              <div className="lg:col-span-7">
                <Card className="h-full bg-white border border-slate-200 shadow-sm p-6 sm:p-8">
                  <CardBody className="p-0 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-atac-green-light border border-border flex items-center justify-center text-atac-green-dark">
                        <Target size={28} />
                      </div>
                      <div>
                        <span className="text-xs font-bold tracking-widest text-atac-green-dark uppercase block">
                          Langkah Nyata
                        </span>
                        <h2 className="text-2xl font-bold text-foreground">
                          Misi Kami
                        </h2>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      {data.mission.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-border text-xs sm:text-sm text-slate-700"
                        >
                          <CheckCircle2
                            size={18}
                            className="text-atac-green-dark shrink-0 mt-0.5"
                          />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </section>
        
        {data.team.length > 0 && (
          <section className="py-16 sm:py-24 border-b border-slate-100">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <span className="text-xs font-bold tracking-wider uppercase text-atac-green-dark block mb-2">
                  Inovator Di Balik Layar
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  TIM INTI KAMI
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.team.map((member, idx) => (
                  <Card
                    key={idx}
                    className="bg-white border border-border hover:border-atac-green-dark hover:shadow-lg transition-all hover:-translate-y-2 duration-300"
                    shadow="sm"
                  >
                    <CardBody className="p-5 text-center flex flex-col items-center">
                      <Avatar
                        src={member.image || `https://ui-avatars.com/api/?background=random&name=${member.name}`}
                        className="w-24 h-24 text-large mb-4 ring-4 ring-green-50"
                      />
                      <h3 className="text-base font-bold text-foreground leading-tight">
                        {member.name}
                      </h3>
                      <p className="text-xs font-medium text-primary mt-1 mb-4">
                        {member.position}
                      </p>

                      {/* Inline Social Media Links */}
                      <div className="flex items-center gap-2 mt-auto pt-3 border-t border-slate-100 w-full justify-center text-slate-400">
                        {member.instagram ? (
                          <a
                            href={member.instagram}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-lg hover:bg-slate-100 hover:text-foreground transition-colors"
                            aria-label="Instagram"
                          >
                            <FaInstagram />
                          </a>
                        ) : null}
                        {member.linkedin ? (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-lg hover:bg-slate-100 hover:text-foreground transition-colors"
                            aria-label="LinkedIn"
                          >
                            <FaLinkedin />
                          </a>
                        ) : null}
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {data.divisions.length > 0 && (
          <section className="py-16 sm:py-20 shadow-sm bg-background">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs font-bold tracking-wider uppercase text-atac-green-dark block mb-2">
                  Struktur Kerja
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  Divisi Tim Kami
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.divisions.map((div, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-atac-green-dark transition-all shadow-sm"
                  >
                    <h3 className="text-base font-bold text-foreground mb-2">
                      {div.divisionName}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {div.divisionJobDescription}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
