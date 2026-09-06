import {
  Button,
  Chip,
  Divider,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { CheckCircle2, ExternalLink } from 'lucide-react';

import type { Donation } from '@/interfaces/donation.interface';
import { formatCurrency, getDonationStatusLabel } from '@/utils/campaign';
import { formatDateTime } from '@/utils/date';

interface DonationDetailModalProps {
  isOpen: boolean;
  donation: Donation | null;
  onClose: () => void;
  onApprove?: (donation: Donation) => void;
}

const getStatusColor = (status: Donation['status']) => {
  switch (status) {
    case 'ACCEPTED':
    case 'ACCEPTED_BY_REVISION':
      return 'success';

    case 'REJECTED':
      return 'danger';

    case 'PENDING':
      return 'warning';

    default:
      return 'default';
  }
};

export default function DonationDetailModal({
  isOpen,
  donation,
  onClose,
  onApprove,
}: DonationDetailModalProps) {
  if (!donation) {
    return null;
  }

  const isPending = donation.status === 'PENDING';

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
      size="3xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>Detail Donasi</ModalHeader>

        <ModalBody>
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">ID Donasi</p>

                <p className="mt-1 break-all font-mono text-sm text-slate-800">
                  {donation.id}
                </p>
              </div>

              <Chip color={getStatusColor(donation.status)} variant="flat">
                {getDonationStatusLabel(donation.status)}
              </Chip>
            </div>

            <Divider />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs text-slate-500">Nama Donatur</p>

                <p className="mt-1 font-semibold text-slate-900">
                  {donation.donorName?.trim() || 'Hamba Allah'}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Nominal</p>

                <p className="mt-1 text-lg font-bold text-green-600">
                  {formatCurrency(donation.amount)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Nominal Diterima</p>

                <p className="mt-1 font-semibold text-slate-900">
                  {formatCurrency(donation.acceptedAmount)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Tanggal</p>

                <p className="mt-1 font-medium text-slate-800">
                  {formatDateTime(donation.createdAt)}
                </p>
              </div>
            </div>

            {donation.message && (
              <div>
                <p className="text-xs text-slate-500">Pesan</p>

                <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  {donation.message}
                </div>
              </div>
            )}

            {donation.reply && (
              <div>
                <p className="text-xs text-slate-500">Balasan Admin</p>

                <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  {donation.reply}
                </div>
              </div>
            )}

            {donation.proofOfPaymentUrl && (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">
                    Bukti Pembayaran
                  </p>

                  <Button
                    as="a"
                    href={donation.proofOfPaymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="sm"
                    variant="flat"
                    startContent={<ExternalLink className="h-4 w-4" />}
                  >
                    Buka
                  </Button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2">
                  <Image
                    src={donation.proofOfPaymentUrl}
                    alt="Bukti pembayaran"
                    className="max-h-[420px] w-full object-contain"
                    radius="lg"
                  />
                </div>
              </div>
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Tutup
          </Button>

          {isPending && onApprove && (
            <Button
              color="success"
              startContent={<CheckCircle2 className="h-4 w-4" />}
              onPress={() => onApprove(donation)}
            >
              Proses Donasi
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
