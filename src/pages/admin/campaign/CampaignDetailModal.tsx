import {
  Button,
  Chip,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { CalendarDays, Target, Users } from 'lucide-react';

import type { Campaign } from '@/interfaces/campaign.interface';
import { formatCurrency, getCampaignStatusLabel } from '@/utils/campaign';
import { formatDateTime } from '@/utils/date';

interface CampaignDetailModalProps {
  isOpen: boolean;
  campaign: Campaign | null;
  onClose: () => void;
}

export default function CampaignDetailModal({
  isOpen,
  campaign,
  onClose,
}: CampaignDetailModalProps) {
  if (!campaign) {
    return null;
  }

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
        <ModalHeader>Detail Campaign</ModalHeader>

        <ModalBody>
          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">
                  {campaign.title}
                </h2>

                <Chip
                  size="sm"
                  color={campaign.status === 'ACTIVE' ? 'success' : 'default'}
                  variant="flat"
                >
                  {getCampaignStatusLabel(campaign.status)}
                </Chip>
              </div>

              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                {campaign.description}
              </p>
            </div>

            <Divider />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <Target className="mb-3 h-5 w-5 text-green-600" />

                <p className="text-xs text-slate-500">Target Donasi</p>

                <p className="mt-1 text-lg font-bold text-slate-900">
                  {formatCurrency(campaign.targetDonationAmount)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <Users className="mb-3 h-5 w-5 text-green-600" />

                <p className="text-xs text-slate-500">Sponsor</p>

                <p className="mt-1 text-lg font-bold text-slate-900">
                  {campaign.sponsorCount}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <CalendarDays className="mb-3 h-5 w-5 text-green-600" />

                <p className="text-xs text-slate-500">Dibuat</p>

                <p className="mt-1 text-sm font-bold text-slate-900">
                  {formatDateTime(campaign.createdAt)}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-900">Periode Campaign</h3>

              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-500">Mulai</p>

                  <p className="mt-1 font-medium text-slate-800">
                    {formatDateTime(campaign.startAt)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Berakhir</p>

                  <p className="mt-1 font-medium text-slate-800">
                    {formatDateTime(campaign.endAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Tutup
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
