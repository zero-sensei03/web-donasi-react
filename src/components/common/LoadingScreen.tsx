import { Spinner } from '@heroui/react';

export const LoadingScreen = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-6 bg-white space-y-8">
      {/* Container Spinner Keren */}
      <div className="relative flex items-center justify-center">
        {/* Ring Efek Pulse di Belakang */}
        <div className="absolute w-20 h-20 rounded-full bg-primary/10 animate-ping" />
        <div className="absolute w-28 h-28 rounded-full bg-primary/5 animate-pulse" />

        {/* HeroUI Spinner */}
        <Spinner
          size="lg"
          color="primary"
          classNames={{
            circle1: 'border-b-atac-green-dark',
            circle2: 'border-b-atac-green',
          }}
        />
      </div>

      {/* Teks Loading */}
      <div className="mt-8 text-center space-y-1.5">
        <h4 className="text-sm font-bold tracking-wide text-slate-900 uppercase">
          Memuat Halaman
        </h4>
        <p className="text-xs font-medium text-slate-400 animate-pulse">
          Ayo Berdonasi • Menyiapkan konten untuk Anda...
        </p>
      </div>
    </div>
  );
};
