import { useState } from 'react';
import {
  Card,
  CardBody,
  Tabs,
  Tab,
  Button,
  Input,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  addToast,
} from '@heroui/react';
import {
  QrCode,
  Building2,
  Copy,
  Check,
  Upload,
  Heart,
  ShieldCheck,
  Send,
  AlertCircle,
} from 'lucide-react';
import { SEO } from '@/components/SEO';
import { useSiteStore } from '@/stores/data-site';
import { InactiveCampaignPage } from '@/components/public/EmptyCampaign';

// ==========================================
// KONSTANTA DATA REKENING & QRIS (Statis)
// ==========================================

export default function DonationPage() {
  const PAYMENT_DETAILS = {
    qrisImage:
      'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020101021126620016ID.CO.BANKBRI.WWW011893600002000001000002150000000000000053033605802ID5910ATACUNSURYA6007JAKARTA6105136106304C1C4',
    qrisName: 'ATAC UNSURYA DONASI',
    bankAccounts: [
      {
        bankName: 'Bank Mandiri',
        accountNumber: '1230009876543',
        accountHolder: 'Tim ATAC Unsurya',
      },
      {
        bankName: 'Bank BCA',
        accountNumber: '8830123456',
        accountHolder: 'Tim ATAC Unsurya',
      },
    ],
  };
  // Disclosures untuk Modal Konfirmasi
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Form State
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  // Copy to Clipboard Handler
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    addToast({
      title: 'Tersalin!',
      description: `Nomor rekening ${text} berhasil disalin.`,
      color: 'success',
    });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Pre-submit validation
  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !amount || !file) {
      addToast({
        title: 'Data Belum Lengkap',
        description: 'Harap isi nama, nominal, dan unggah bukti transfer.',
        color: 'danger',
      });
      return;
    }
    onOpen(); // Buka modal konfirmasi
  };

  // Final Submit Handler
  const handleFinalSubmit = () => {
    onClose();

    // Tampilkan Toast Sukses dari HeroUI
    addToast({
      title: 'Konfirmasi Terkirim! 🚀',
      description:
        'Terima kasih atas dukungan Anda. Data donasi akan segera kami verifikasi.',
      color: 'success',
    });

    // Reset Form
    setName('');
    setAmount('');
    setMessage('');
    setFile(null);
  };

  const campaign = useSiteStore((state) => state.campaignData);
  if(!campaign) {
    return <InactiveCampaignPage />
  }

  return (
    <>
      <SEO title="Dukung & Donasi" description="Mari ikut berkontribusi melalui donasi dan dukung berbagai kegiatan agar dapat terus berkembang dan memberikan manfaat yang lebih luas." />
      <div className="w-full bg-white text-slate-900 min-h-screen pt-28 pb-16 lg:pt-32 lg:pb-24">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* ================= HEADER ================= */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
              <Heart size={24} className="fill-rose-500" />
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
              Dukung Perjuangan Kami
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Dukungan Anda memberikan dampak nyata bagi keberhasilan setiap
              langkah dan inisiatif yang kami perjuangkan.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ================= 1. INFORMASI PEMBAYARAN (QRIS / TRANSFER) ================= */}
            <div className="lg:col-span-5">
              <Card
                className="bg-slate-50 border border-slate-200 shadow-sm"
                shadow="none"
              >
                <CardBody className="p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span>Pilihan Pembayaran</span>
                  </h2>

                  <Tabs
                    aria-label="Metode Pembayaran"
                    fullWidth
                    variant="solid"
                    color="primary"
                    classNames={{
                      tabList: 'bg-slate-200/60 p-1 rounded-xl',
                      tab: 'text-xs font-semibold py-2',
                    }}
                  >
                    {/* TAB QRIS */}
                    <Tab
                      key="qris"
                      title={
                        <div className="flex items-center gap-2">
                          <QrCode size={16} />
                          <span>QRIS</span>
                        </div>
                      }
                    >
                      <div className="pt-4 flex flex-col items-center text-center bg-white p-6 rounded-2xl border border-slate-200/80">
                        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm mb-3">
                          <img
                            src={PAYMENT_DETAILS.qrisImage}
                            alt="QRIS Donasi"
                            className="w-48 h-48 object-contain"
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-900 mb-1">
                          {PAYMENT_DETAILS.qrisName}
                        </span>
                        <p className="text-[11px] text-slate-500">
                          Mendukung GoPay, OVO, Dana, ShopeePay, LinkAja, & Mobile
                          Banking.
                        </p>
                      </div>
                    </Tab>

                    {/* TAB TRANSFER BANK */}
                    <Tab
                      key="bank"
                      title={
                        <div className="flex items-center gap-2">
                          <Building2 size={16} />
                          <span>Transfer Bank</span>
                        </div>
                      }
                    >
                      <div className="pt-4 space-y-3">
                        {PAYMENT_DETAILS.bankAccounts.map((acc, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between"
                          >
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                                {acc.bankName}
                              </span>
                              <span className="text-base font-mono font-bold text-slate-900 block mt-0.5">
                                {acc.accountNumber}
                              </span>
                              <span className="text-xs text-slate-500 font-medium">
                                a.n. {acc.accountHolder}
                              </span>
                            </div>

                            <Button
                              isIconOnly
                              size="sm"
                              variant="flat"
                              onClick={() =>
                                handleCopy(acc.accountNumber, `acc-${idx}`)
                              }
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700"
                            >
                              {copiedIndex === `acc-${idx}` ? (
                                <Check size={16} className="text-emerald-600" />
                              ) : (
                                <Copy size={16} />
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </Tab>
                  </Tabs>

                  <div className="mt-6 flex items-start gap-2.5 p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 text-blue-900 text-xs">
                    <ShieldCheck
                      size={18}
                      className="text-blue-600 shrink-0 mt-0.5"
                    />
                    <p className="leading-relaxed">
                      Setiap dana yang masuk dialokasikan 100% untuk kebutuhan
                      riset, pembelian bahan baku UAV, dan operasional kompetisi.
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* ================= 2. FORM KONFIRMASI DONASI ================= */}
            <div className="lg:col-span-7">
              <Card
                className="bg-white border border-slate-200 shadow-sm"
                shadow="none"
              >
                <CardBody className="p-6 sm:p-8">
                  <h2 className="text-xl font-bold text-slate-900 mb-1">
                    Konfirmasi Pembayaran
                  </h2>
                  <p className="text-xs text-slate-500 mb-6">
                    Silakan isi formulir di bawah ini setelah Anda berhasil
                    melakukan transfer/pembayaran QRIS.
                  </p>

                  <form onSubmit={handlePreSubmit} className="space-y-10">
                    {/* Nama Donatur */}
                    <Input
                      isRequired
                      label="Nama Lengkap / Hamba Allah"
                      placeholder="Masukkan nama Anda..."
                      labelPlacement="outside"
                      variant="bordered"
                      value={name}
                      onValueChange={setName}
                    />

                    {/* Nominal Donasi */}
                    <Input
                      isRequired
                      type="number"
                      label="Nominal Donasi (Rp)"
                      placeholder="Contoh: 100000"
                      labelPlacement="outside"
                      variant="bordered"
                      startContent={
                        <span className="text-xs font-bold text-slate-400">
                          Rp
                        </span>
                      }
                      value={amount}
                      onValueChange={setAmount}
                    />

                    {/* Upload Bukti Pembayaran */}
                    <div className="space-y-1.5 -mt-4 mb-4">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Bukti Pembayaran <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-2xl p-4 transition-colors bg-slate-50/50 flex flex-col items-center justify-center text-center cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          required
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                          <Upload size={20} />
                        </div>
                        <p className="text-xs font-medium text-slate-700">
                          {file
                            ? file.name
                            : 'Klik atau seret foto bukti transfer di sini'}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Format JPG, PNG (Maks. 5MB)
                        </p>
                      </div>
                    </div>

                    {/* Pesan / Dukungan */}
                    <Textarea
                      label="Pesan / Doa Dukungan (Opsional)"
                      placeholder="Tuliskan pesan atau doa untuk Tim ATAC..."
                      labelPlacement="outside"
                      variant="bordered"
                      minRows={3}
                      value={message}
                      onValueChange={setMessage}
                    />

                    {/* Button Kirim */}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-blue-600 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:bg-blue-500"
                      endContent={<Send size={16} />}
                    >
                      Kirim Konfirmasi
                    </Button>
                  </form>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>

        {/* ================= MODAL KONFIRMASI (SEBELUM SUBMIT) ================= */}
        <Modal isOpen={isOpen} onClose={onClose} size="md" backdrop="blur">
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 text-base font-bold">
                <AlertCircle size={20} className="text-blue-600" />
                <span>Konfirmasi Data Donasi</span>
              </div>
            </ModalHeader>

            <ModalBody className="py-5 text-sm text-slate-600 space-y-3">
              <p className="text-xs text-slate-500">
                Pastikan rincian data konfirmasi donasi Anda sudah sesuai sebelum
                dikirimkan ke tim verifikasi.
              </p>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Nama Donatur:</span>
                  <span className="font-bold text-slate-900">{name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Nominal:</span>
                  <span className="font-bold text-emerald-600">
                    Rp {Number(amount).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Bukti Transfer:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[180px]">
                    {file?.name}
                  </span>
                </div>
                {message && (
                  <div className="pt-1">
                    <span className="text-slate-500 block mb-1">Pesan:</span>
                    <p className="italic text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                      "{message}"
                    </p>
                  </div>
                )}
              </div>
            </ModalBody>

            <ModalFooter className="border-t border-slate-100 pt-3">
              <Button
                variant="flat"
                color="default"
                size="sm"
                onClick={onClose}
                className="font-medium"
              >
                Cek Kembali
              </Button>
              <Button
                color="primary"
                size="sm"
                onClick={handleFinalSubmit}
                className="bg-blue-600 font-semibold"
              >
                Ya, Sudah Benar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}
