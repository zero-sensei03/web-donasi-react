import { Button } from '@heroui/react';
import { ArrowLeft, HeartHandshake, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-xl text-center">
        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-atac-green-soft">
          <HeartHandshake size={38} className="text-atac-green-dark" />
        </div>

        {/* 404 */}
        <p className="mt-8 text-7xl font-black tracking-tight text-atac-green-dark sm:text-8xl">
          404
        </p>

        <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
          Halaman Tidak Ditemukan
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
          Maaf, halaman yang kamu cari tidak tersedia atau mungkin sudah
          dipindahkan. Silakan kembali ke halaman sebelumnya atau menuju
          beranda.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            variant="flat"
            startContent={<ArrowLeft size={17} />}
            onPress={() => navigate(-1)}
          >
            Kembali
          </Button>

          <Button
            color="primary"
            startContent={<Home size={17} />}
            onPress={() => navigate('/')}
          >
            Ke Beranda
          </Button>
        </div>

        {/* Footer */}
        <p className="mt-10 text-xs text-slate-400">
          Halaman yang kamu tuju tidak dapat ditemukan.
        </p>
      </div>
    </div>
  );
}
