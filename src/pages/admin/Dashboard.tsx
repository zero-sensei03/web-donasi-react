import { Card, CardBody, Chip } from '@heroui/react';
import {
  HeartHandshake,
  Image,
  Megaphone,
  Settings,
  ShieldCheck,
} from 'lucide-react';

import { useAuthStore } from '@/stores/auth';

export default function Dashboard() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-atac-green-dark">
          Platform Donasi
        </p>

        <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
          Beranda
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
          Selamat datang di halaman administrasi platform donasi. Kelola konten,
          campaign, donasi, dan informasi platform dari satu tempat.
        </p>
      </div>

      {/* Welcome Card */}
      <Card
        shadow="none"
        className="overflow-hidden border border-slate-200 bg-white"
      >
        <CardBody className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-atac-green-soft">
                <HeartHandshake size={28} className="text-atac-green-dark" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Selamat datang 👋
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                  Terima kasih telah menjadi bagian dari pengelolaan platform
                  donasi. Pastikan informasi dan konten yang ditampilkan kepada
                  donatur selalu diperbarui dan mudah dipahami.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-2 sm:items-end">
              <Chip
                size="sm"
                variant="flat"
                color="success"
                startContent={<ShieldCheck size={14} />}
              >
                {user?.role ?? 'Administrator'}
              </Chip>

              <p className="text-xs text-slate-400">{user?.email ?? '-'}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Platform Information */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card shadow="none" className="border border-slate-200 bg-white">
          <CardBody className="p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-atac-green-soft">
              <Megaphone size={21} className="text-atac-green-dark" />
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">Campaign</h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Kelola informasi campaign, tujuan donasi, periode, dan konten
              campaign yang tersedia di platform.
            </p>
          </CardBody>
        </Card>

        <Card shadow="none" className="border border-slate-200 bg-white">
          <CardBody className="p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-atac-green-soft">
              <HeartHandshake size={21} className="text-atac-green-dark" />
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">Donasi</h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Periksa dan kelola data donasi yang masuk beserta bukti pembayaran
              dari para donatur.
            </p>
          </CardBody>
        </Card>

        <Card shadow="none" className="border border-slate-200 bg-white">
          <CardBody className="p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-atac-green-soft">
              <Image size={21} className="text-atac-green-dark" />
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              Konten Platform
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Atur berbagai informasi dan media yang ditampilkan pada halaman
              utama platform donasi.
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Quick Information */}
      <Card shadow="none" className="border border-slate-200 bg-white">
        <CardBody className="p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
              <Settings size={19} className="text-slate-600" />
            </div>

            <div>
              <h2 className="font-bold text-lg text-slate-900">
                Informasi Administrasi
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Gunakan menu di samping untuk mengelola platform.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm leading-6 text-slate-600">
              Platform ini menyediakan fasilitas pengelolaan campaign, donasi,
              konten halaman, media, metode pembayaran, serta informasi kontak.
              Pastikan setiap informasi yang dipublikasikan sesuai dengan
              kondisi dan kebutuhan platform.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
