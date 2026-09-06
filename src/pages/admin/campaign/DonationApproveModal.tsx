import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from '@heroui/react';
import { useEffect, useState } from 'react';

import type { Donation, DonationStatus } from '@/interfaces/donation.interface';
import { formatCurrency } from '@/utils/campaign';

interface DonationApproveModalProps {
  isOpen: boolean;
  donation: Donation | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    status: DonationStatus;
    amount?: number;
    reply?: string | null;
  }) => void;
}

export default function DonationApproveModal({
  isOpen,
  donation,
  isSubmitting = false,
  onClose,
  onSubmit,
}: DonationApproveModalProps) {
  const [status, setStatus] = useState<DonationStatus>('ACCEPTED');

  const [amount, setAmount] = useState('');
  const [reply, setReply] = useState('');

  useEffect(() => {
    if (!isOpen || !donation) {
      return;
    }

    setStatus('ACCEPTED');
    setAmount(String(donation.amount));
    setReply('');
  }, [isOpen, donation]);

  if (!donation) {
    return null;
  }

  const handleSubmit = () => {
    const acceptedAmount = Number(amount);

    if (
      status === 'ACCEPTED' &&
      (!Number.isFinite(acceptedAmount) || acceptedAmount < 0)
    ) {
      return;
    }

    onSubmit({
      status,
      amount: status !== 'REJECTED' ? acceptedAmount : 0,
      reply: reply.trim() || null,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
      size="lg"
    >
      <ModalContent>
        <ModalHeader>Proses Donasi</ModalHeader>

        <ModalBody>
          <div className="space-y-5">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Donatur</p>

              <p className="mt-1 font-semibold text-slate-900">
                {donation.donorName?.trim() || 'Hamba Allah'}
              </p>

              <p className="mt-3 text-xs text-slate-500">Nominal Donasi</p>

              <p className="mt-1 text-lg font-bold text-green-600">
                {formatCurrency(donation.amount)}
              </p>
            </div>

            <Select
              label="Status"
              selectedKeys={[status]}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0];

                if (value === 'ACCEPTED' || value === 'REJECTED') {
                  setStatus(value);
                }
              }}
            >
              <SelectItem key="ACCEPTED">Terima Donasi</SelectItem>

              <SelectItem key="REJECTED">Tolak Donasi</SelectItem>
            </Select>

            {status === 'ACCEPTED' && (
              <Input
                type="number"
                label="Nominal Diterima"
                min="0"
                value={amount}
                onValueChange={setAmount}
                startContent={
                  <span className="text-sm font-semibold text-slate-500">
                    Rp
                  </span>
                }
              />
            )}

            <Textarea
              label="Balasan"
              placeholder="Tambahkan balasan untuk donatur (opsional)"
              value={reply}
              onValueChange={setReply}
              minRows={4}
            />
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="flat" onPress={onClose} isDisabled={isSubmitting}>
            Batal
          </Button>

          <Button
            color={status === 'ACCEPTED' ? 'success' : 'danger'}
            onPress={handleSubmit}
            isLoading={isSubmitting}
          >
            {status === 'ACCEPTED' ? 'Terima Donasi' : 'Tolak Donasi'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
