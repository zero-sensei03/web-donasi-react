import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from '@heroui/react';
import { useEffect, useState } from 'react';
import { CalendarDays } from 'lucide-react';

import type {
  Campaign,
  CampaignFormValues,
} from '@/interfaces/campaign.interface';
import { toUTCDateTime } from '@/utils/date';

interface CampaignFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign?: Campaign | null;
  isSubmitting?: boolean;
  onSubmit: (payload: {
    startAt: string;
    endAt: string;
    title: string;
    description: string;
    targetDonationAmount: number;
    sponsorCount: number;
  }) => void;
}

const getLocalDateTimeValue = (value: string | Date): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const pad = (number: number) => String(number).padStart(2, '0');

  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1
  )}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const emptyForm: CampaignFormValues = {
  startAt: '',
  endAt: '',
  title: '',
  description: '',
  targetDonationAmount: '',
  sponsorCount: '',
};

export default function CampaignFormModal({
  isOpen,
  onClose,
  campaign,
  isSubmitting = false,
  onSubmit,
}: CampaignFormModalProps) {
  const [form, setForm] = useState<CampaignFormValues>(emptyForm);

  const [error, setError] = useState('');

  const isEdit = Boolean(campaign);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (campaign) {
      setForm({
        startAt: getLocalDateTimeValue(campaign.startAt),
        endAt: getLocalDateTimeValue(campaign.endAt),
        title: campaign.title,
        description: campaign.description,
        targetDonationAmount: String(campaign.targetDonationAmount),
        sponsorCount: String(campaign.sponsorCount),
      });
    } else {
      setForm(emptyForm);
    }

    setError('');
  }, [isOpen, campaign]);

  const updateField = (field: keyof CampaignFormValues, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    setError('');

    if (
      !form.startAt ||
      !form.endAt ||
      !form.title.trim() ||
      !form.description.trim()
    ) {
      setError('Semua field wajib diisi.');
      return;
    }

    const startDate = new Date(form.startAt);
    const endDate = new Date(form.endAt);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      setError('Tanggal campaign tidak valid.');
      return;
    }

    if (endDate <= startDate) {
      setError('End date harus lebih besar dari start date.');
      return;
    }

    const targetDonationAmount = Number(form.targetDonationAmount);

    const sponsorCount = Number(form.sponsorCount);

    if (!Number.isFinite(targetDonationAmount) || targetDonationAmount < 0) {
      setError('Target donasi tidak valid.');
      return;
    }

    if (!Number.isInteger(sponsorCount) || sponsorCount < 0) {
      setError('Sponsor count harus berupa angka bulat.');
      return;
    }

    onSubmit({
      startAt: toUTCDateTime(startDate),
      endAt: toUTCDateTime(endDate),
      title: form.title.trim(),
      description: form.description.trim(),
      targetDonationAmount,
      sponsorCount,
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
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>
          {isEdit ? 'Edit Campaign' : 'Tambah Campaign'}
        </ModalHeader>

        <ModalBody>
          <div className="space-y-5">
            {error && (
              <div className="rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
                {error}
              </div>
            )}

            <Input
              label="Judul Campaign"
              placeholder="Masukkan judul campaign"
              value={form.title}
              onValueChange={(value) => updateField('title', value)}
              isRequired
            />

            <Textarea
              label="Deskripsi"
              placeholder="Masukkan deskripsi campaign"
              value={form.description}
              onValueChange={(value) => updateField('description', value)}
              minRows={5}
              isRequired
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                type="datetime-local"
                label="Mulai Campaign"
                value={form.startAt}
                onChange={(event) => updateField('startAt', event.target.value)}
                startContent={
                  <CalendarDays className="h-4 w-4 text-slate-400" />
                }
                isRequired
              />

              <Input
                type="datetime-local"
                label="Selesai Campaign"
                value={form.endAt}
                onChange={(event) => updateField('endAt', event.target.value)}
                startContent={
                  <CalendarDays className="h-4 w-4 text-slate-400" />
                }
                isRequired
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                type="number"
                label="Target Donasi"
                placeholder="0"
                min="0"
                value={form.targetDonationAmount}
                onValueChange={(value) =>
                  updateField('targetDonationAmount', value)
                }
                startContent={
                  <span className="text-sm font-semibold text-slate-500">
                    Rp
                  </span>
                }
                isRequired
              />

              <Input
                type="number"
                label="Jumlah Sponsor"
                placeholder="0"
                min="0"
                step="1"
                value={form.sponsorCount}
                onValueChange={(value) => updateField('sponsorCount', value)}
                isRequired
              />
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="flat" onPress={onClose} isDisabled={isSubmitting}>
            Batal
          </Button>

          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={isSubmitting}
          >
            {isEdit ? 'Simpan Perubahan' : 'Buat Campaign'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
