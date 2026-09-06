import type { CampaignStatus } from '@/interfaces/campaign.interface';
import type { DonationStatus } from '@/interfaces/donation.interface';

export const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined) {
    return 'Rp0';
  }

  return `Rp${value.toLocaleString('id-ID')}`;
};

export const getCampaignStatusLabel = (status: CampaignStatus): string => {
  switch (status) {
    case 'ACTIVE':
      return 'Aktif';

    case 'INACTIVE':
      return 'Tidak Aktif';

    default:
      return status;
  }
};

export const getDonationStatusLabel = (status: DonationStatus): string => {
  switch (status) {
    case 'PENDING':
      return 'Menunggu';

    case 'ACCEPTED':
      return 'Diterima';

    case 'REJECTED':
      return 'Ditolak';

    case 'ACCEPTED_BY_REVISION':
      return 'Diterima dengan Revisi';

    default:
      return status;
  }
};
