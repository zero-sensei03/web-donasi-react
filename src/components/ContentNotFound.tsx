import { Card, CardBody } from '@heroui/react';
import { FileSearch } from 'lucide-react';

export default function ContentNotFound() {
  return (
    <Card className="bg-white flex items-center justify-center px-6 py-8">
      <CardBody className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <FileSearch size={38} strokeWidth={1.5} />
        </div>

        {/* Content */}
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Konten Belum Tersedia
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
          Maaf, konten yang kamu cari belum tersedia untuk saat ini. Silakan
          kembali lagi nanti untuk melihat informasi terbaru.
        </p>
      </CardBody>
    </Card>
  );
}
