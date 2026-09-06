import { useMemo, useState } from 'react';
import {
  Card,
  CardBody,
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  Skeleton,
} from '@heroui/react';
import { Play, Maximize2, Image as ImageIcon, Film } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { useSiteStore } from '@/stores/data-site';
import { InactiveCampaignPage } from '@/components/public/EmptyCampaign';
import { useGetGalleryPublic } from '@/services/gallery';
import ContentNotFound from '@/components/ContentNotFound';
import type { GalleryRes } from '@/interfaces/gallery.interface';
import { formatDateTime } from '@/utils/date';

// ==========================================
// KONSTANTA DATA GALERI (Simulasi Backend)
// ==========================================

export default function GalleryPage() {
  const categories = [
    { key: 'all', label: 'Semua' },
    { key: 'image', label: 'Foto' },
    { key: 'video', label: 'Video' },
  ];

  const campaign = useSiteStore((state) => state.campaignData);
  if (!campaign) {
    return <InactiveCampaignPage />;
  }

  const { data: galleryData, isLoading: isLoadingGallery } =
    useGetGalleryPublic(campaign.id);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<GalleryRes | null>(null);
  const FETCH_GALLERY = useMemo(() => {
    return (galleryData?.data || []).filter((item) =>
      activeCategory === 'image'
        ? item.galleryType === 'IMAGE'
        : activeCategory === 'video'
          ? item.galleryType === 'VIDEO'
          : item
    );
  }, [galleryData, activeCategory]);

  return (
    <>
      <SEO
        title="Galeri"
        description="Lihat berbagai dokumentasi kegiatan dan momen yang terwujud melalui dukungan, kepedulian, dan kontribusi para donatur."
      />
      <div className="w-full bg-white text-slate-900 min-h-screen pt-28 pb-16 lg:pt-32 lg:pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* ================= HEADER ================= */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-wider uppercase text-primary block mb-2">
              Dokumentasi
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
              Galeri Kegiatan & Karya
            </h1>

            {/* Filter Tab Buttons */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-5 py-2 rounded-lg lg:text-base text-xs font-semibold transition-all cursor-pointer ${
                    activeCategory === cat.key
                      ? 'bg-atac-green-dark text-white shadow-sm shadow-primary'
                      : 'bg-atac-green-soft/80 text-atac-green hover:bg-atac-green-light'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {isLoadingGallery ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card
                  key={index}
                  className="relative overflow-hidden rounded-2xl border-none"
                >
                  <CardBody className="p-0 relative aspect-[4/3] w-full overflow-hidden">
                    {/* Image Skeleton */}
                    <Skeleton className="absolute inset-0 rounded-none">
                      <div className="w-full h-full bg-default-300" />
                    </Skeleton>

                    {/* Type Badge Skeleton */}
                    <div className="absolute top-3 right-3 z-10">
                      <Skeleton className="rounded-full">
                        <div className="w-16 h-6 rounded-full" />
                      </Skeleton>
                    </div>

                    {/* Bottom Content Skeleton */}
                    <div className="absolute inset-x-0 bottom-0 z-10 p-5">
                      <Skeleton className="rounded-md mb-2">
                        <div className="w-20 h-3 rounded-md" />
                      </Skeleton>

                      <Skeleton className="rounded-md">
                        <div className="w-3/4 h-5 rounded-md" />
                      </Skeleton>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : FETCH_GALLERY.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FETCH_GALLERY.map((item) => (
                <Card
                  key={item.id}
                  isPressable
                  onClick={() => setSelectedItem(item)}
                  className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <CardBody className="p-0 relative aspect-[4/3] w-full overflow-hidden bg-atac-green-light">
                    {/* Image / Thumbnail */}
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    />

                    {/* Badge Type */}
                    <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-slate-900/70 backdrop-blur-md text-white text-[10px] font-semibold flex items-center gap-1.5 border border-white/20">
                      {item.galleryType === 'VIDEO' ? (
                        <>
                          <Film size={12} className="text-blue-400" /> Video
                        </>
                      ) : (
                        <>
                          <ImageIcon size={12} className="text-emerald-400" />{' '}
                          Foto
                        </>
                      )}
                    </div>

                    {/* Video Play Overlay */}
                    {item.galleryType === 'VIDEO' && (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="w-12 h-12 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play size={20} className="fill-white ml-0.5" />
                        </div>
                      </div>
                    )}

                    {/* Overlay Text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-5 text-left text-white opacity-95 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-mono mb-1">
                        {formatDateTime(item.timeStamp)}
                      </span>

                      <h3 className="text-base font-bold line-clamp-1 group-hover:text-green-200 transition-colors">
                        {item.title}
                      </h3>
                    </div>

                    {/* Hover Expand Icon */}
                    <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg bg-slate-900/60 backdrop-blur-md text-white">
                      <Maximize2 size={14} />
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <ContentNotFound />
          )}
        </div>

        {/* ================= FULLSCREEN LIGHTBOX MODAL ================= */}
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          size="3xl"
          backdrop="blur"
          classNames={{
            closeButton:
              'bg-atac-green-dark text-white hover:bg-atac-green cursor-pointer mt-3 me-2',
          }}
        >
          <ModalContent>
            <ModalHeader>{selectedItem?.title}</ModalHeader>
            {selectedItem && (
              <ModalBody className="p-4 sm:p-6 max-h-[72vh] overflow-y-auto scrollbar-hide">
                {/* Media Container (Foto / Video) */}
                <div className="w-full h-auto mb-4 relative">
                  {selectedItem.galleryType === 'VIDEO' &&
                  selectedItem.videoUrl ? (
                    <video
                      controls
                      autoPlay
                      src={selectedItem.videoUrl}
                      className="w-full max-h-[70vh] object-contain"
                    >
                      Browser Anda tidak mendukung tag video.
                    </video>
                  ) : (
                    <img
                      src={selectedItem.imageUrl}
                      alt={selectedItem.title}
                      className="w-full object-contain rounded-2xl"
                    />
                  )}
                  <span className="text-xs font-mono shrink-0 absolute bottom-0 bg-navy p-2 text-white right-0 rounded-tl-2xl rounded-br-2xl">
                    {formatDateTime(selectedItem.timeStamp)}
                  </span>
                </div>

                {/* Media Title & Description */}
                <div className="w-full text-left">
                  <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed text-justify">
                    {selectedItem.description}
                  </p>
                </div>
              </ModalBody>
            )}
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}
