import { useMemo } from 'react';
import { Card, CardBody, Button, Chip } from '@heroui/react';
import {
  FileText,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { SEO } from '@/components/SEO';
import { useSiteStore } from '@/stores/data-site';
import { InactiveCampaignPage } from '@/components/public/EmptyCampaign';
import { useGetProposalPublic } from '@/services/proposal';
import ContentNotFound from '@/components/ContentNotFound';

// ==========================================
// KONSTANTA DATA PROPOSAL (Simulasi Backend)
// ==========================================

export default function ProposalPage() {
  const campaign = useSiteStore((state) => state.campaignData);

  const { data: proposalData, isLoading } = useGetProposalPublic(campaign?.id || "");
  const PROPOSAL_FETCH = useMemo(() => {
    return proposalData?.data || [];
  }, [proposalData])

  if(!campaign) {
    return <InactiveCampaignPage />
  }
  return (
    <>
      <SEO title="Proposal Kegiatan" description="Lihat informasi dan proposal kegiatan yang menjadi tujuan dukungan dan donasi untuk mewujudkan program yang bermanfaat." />
      <div className="w-full bg-white text-slate-900 min-h-screen pt-28 pb-16 lg:pt-32 lg:pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* ================= HEADER ================= */}
          <div className="text-center max-w-3xl mx-auto mb-8">
            <Chip
              variant="flat"
              size="sm"
              className="mb-4 font-semibold uppercase tracking-wider text-xs bg-atac-green-light text-atac-green-dark border border-atac-green px-4"
              startContent={<Sparkles className="size-3.5 me-2" />}
            >
              Dokumen Resmi
            </Chip>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-3">
              Proposal Sponsorship & Kerjasama
            </h1>
          </div>
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-slate-400 text-xs">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
              <span>Memuat Dokumen Proposal...</span>
            </div>
          ) : PROPOSAL_FETCH.length > 0 ?(
            <div className="flex flex-col space-y-12">
              {PROPOSAL_FETCH.map(item => (
                <div key={item.id}>
                  <div className="text-center max-w-3xl mx-auto mb-10">
                    <p className="text-base sm:text-xl font-semibold text-primary mb-4">
                      {item.title}
                    </p>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
                      {item.description}
                    </p>

                    {/* ACTION BUTTONS */}
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                      <Button
                        as="a"
                        href={item.proposalPdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        size="md"
                        variant="flat"
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                        startContent={<ExternalLink size={16} />}
                      >
                        Buka di Tab Baru
                      </Button>
                    </div>

                  </div>
                  <Card
                    className="bg-slate-50 border border-slate-200 shadow-xl rounded-3xl overflow-hidden"
                    shadow="none"
                  >
                    <CardBody className="p-2 sm:p-4">
                      {/* Toolbar Status Ringkas */}
                      <div className="flex items-center justify-between px-3 py-2 mb-2 bg-white rounded-xl border border-slate-200/80 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-atac-green" />
                          <span className="font-medium text-slate-800 truncate max-w-[200px] sm:max-w-none">
                            {item.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <ShieldCheck size={14} />
                          <span className="sm:block hidden">Terverifikasi</span>
                        </div>
                      </div>

                      {/* Embedded PDF Viewer */}
                      <div className="relative w-full h-[600px] sm:h-[750px] lg:h-[850px] rounded-2xl overflow-hidden bg-slate-200/60 border border-slate-200">
                        <iframe
                          src={`${item.proposalPdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                          title="Proposal PDF Viewer"
                          className="w-full h-full border-0 rounded-2xl"
                        />
                      </div>
                    </CardBody>
                  </Card>
                </div>
              ))}
            </div>
          ) : <ContentNotFound />}
        </div>
      </div>
    </>
  );
}
