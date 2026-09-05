import { useState } from 'react';
import {
  Card,
  CardBody,
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
} from '@heroui/react';
import { Play, Maximize2, Image as ImageIcon, Film } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { useSiteStore } from '@/stores/data-site';
import { InactiveCampaignPage } from '@/components/public/EmptyCampaign';

// ==========================================
// KONSTANTA DATA GALERI (Simulasi Backend)
// ==========================================

export default function GalleryPage() {
  const GALLERY_PAGE_DATA = {
    items: [
      {
        id: '1',
        title: 'Pengujian Aerodinamika Wahana UAV',
        description:
          'Uji terbang perdana prototipe sayap tetap di area lapangan terbuka. Uji terbang perdana prototipe sayap tetap di area lapangan terbuka. Uji terbang perdana prototipe sayap tetap di area lapangan terbuka. Uji terbang perdana prototipe sayap tetap di area lapangan terbuka. Uji terbang perdana prototipe sayap tetap di area lapangan terbuka. Uji terbang perdana prototipe sayap tetap di area lapangan terbuka. Uji terbang perdana prototipe sayap tetap di area lapangan terbuka. Uji terbang perdana prototipe sayap tetap di area lapangan terbuka. Uji terbang perdana prototipe sayap tetap di area lapangan terbuka. Uji terbang perdana prototipe sayap tetap di area lapangan terbuka. Uji terbang perdana prototipe sayap tetap di area lapangan terbuka. Uji terbang perdana prototipe sayap tetap di area lapangan terbuka. Uji terbang perdana prototipe sayap tetap di area lapangan terbuka.Uji terbang perdana prototipe sayap tetap di area lapangan terbuka.Uji terbang perdana prototipe sayap tetap di area lapangan terbuka.Uji terbang perdana prototipe sayap tetap di area lapangan terbuka.Uji terbang perdana prototipe sayap tetap di area lapangan terbuka.Uji terbang perdana prototipe sayap tetap di area lapangan terbuka.Uji terbang perdana prototipe sayap tetap di area lapangan terbuka.Uji terbang perdana prototipe sayap tetap di area lapangan terbuka.Uji terbang perdana prototipe sayap tetap di area lapangan terbuka.Uji terbang perdana prototipe sayap tetap di area lapangan terbuka.Uji terbang perdana prototipe sayap tetap di area lapangan terbuka.',
        type: 'image',
        category: 'image',
        src: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=1200',
        date: '12 Agustus 2026',
      },
      {
        id: '2',
        title: 'Dokumentasi Pitching & Presentasi Tim',
        description:
          'Pemaparan hasil riset sistem otonom di depan para penguji.',
        type: 'video',
        category: 'video',
        // Bisa pake direct MP4 atau Embed YouTube
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnail:
          'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200',
        date: '05 Juli 2026',
      },
      {
        id: '3',
        title: 'Proses Solder & Assembly Avionik',
        description:
          'Pemasangan komponen micro-controller dan sensor telemetry pada flight controller.',
        type: 'image',
        category: 'image',
        src: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200',
        date: '20 Juni 2026',
      },
      {
        id: '4',
        title: 'Simulasi Ground Control Station (GCS)',
        description:
          'Uji coba software pemantauan jalur terbang secara real-time.',
        type: 'image',
        category: 'image',
        src: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200',
        date: '15 Mei 2026',
      },
      {
        id: '5',
        title: 'Highlight Persiapan Lomba',
        description:
          'Video kilas balik perjuangan tim selama masa karantina riset.',
        type: 'video',
        category: 'video',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnail:
          'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200',
        date: '01 Mei 2026',
      },
      {
        id: '6',
        title: 'Foto Bersama Anggota Tim ATAC',
        description:
          'Momen kebersamaan seluruh devisi setelah perakitan fisik wahana selesai.',
        type: 'image',
        category: 'image',
        src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200',
        date: '10 April 2026',
      },
    ],
  };

  const categories = [
    { key: 'all', label: 'Semua' },
    { key: 'image', label: 'Foto' },
    { key: 'video', label: 'Video' },
  ];
  const data = GALLERY_PAGE_DATA;
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<
    (typeof data.items)[0] | null
  >(null);

  // Filter Items
  const filteredItems = data.items.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.type === activeCategory;
  });

  const campaign = useSiteStore((state) => state.campaignData);
  if(!campaign) {
    return <InactiveCampaignPage />
  }

  return (
    <>
      <SEO title="Galeri" description="Lihat berbagai dokumentasi kegiatan dan momen yang terwujud melalui dukungan, kepedulian, dan kontribusi para donatur." />
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

          {/* ================= GALLERY GRID ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                isPressable
                onClick={() => setSelectedItem(item)}
                className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <CardBody className="p-0 relative aspect-[4/3] w-full overflow-hidden bg-atac-green-light">
                  {/* Image / Thumbnail */}
                  <img
                    src={item.type === 'video' ? item.thumbnail : item.src}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />

                  {/* Badge Type (Top Right) */}
                  <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-slate-900/70 backdrop-blur-md text-white text-[10px] font-semibold flex items-center gap-1.5 border border-white/20">
                    {item.type === 'video' ? (
                      <>
                        <Film size={12} className="text-blue-400" /> Video
                      </>
                    ) : (
                      <>
                        <ImageIcon size={12} className="text-emerald-400" /> Foto
                      </>
                    )}
                  </div>

                  {/* Video Play Overlay Icon */}
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="w-12 h-12 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play size={20} className="fill-white ml-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Overlay Text info (Bottom) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-5 text-left text-white opacity-95 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-mono mb-1">
                      {item.date}
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
                  {selectedItem.type === 'video' ? (
                    <video
                      controls
                      autoPlay
                      src={selectedItem.src}
                      className="w-full max-h-[70vh] object-contain"
                    >
                      Browser Anda tidak mendukung tag video.
                    </video>
                  ) : (
                    <img
                      src={selectedItem.src}
                      alt={selectedItem.title}
                      className="w-full object-contain rounded-2xl"
                    />
                  )}
                  <span className="text-xs font-mono shrink-0 absolute bottom-0 bg-navy p-2 text-white right-0 rounded-tl-2xl rounded-br-2xl">
                    {selectedItem.date}
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
