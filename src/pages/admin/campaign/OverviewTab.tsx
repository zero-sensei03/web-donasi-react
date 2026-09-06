import type { Campaign } from '@/interfaces/campaign.interface';
import { formatCurrency } from '@/utils/campaign';
import { formatDateTime } from '@/utils/date';
import { Card, CardBody } from '@heroui/react';

export const OverviewTab = ({ campaign }: { campaign: Campaign }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Informasi Campaign</h2>

        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
          {campaign.description}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card shadow="none" className="border border-slate-200 bg-slate-50">
          <CardBody>
            <p className="text-xs text-slate-500">Target Donasi</p>

            <p className="mt-1 text-xl font-bold text-slate-900">
              {formatCurrency(campaign.targetDonationAmount)}
            </p>
          </CardBody>
        </Card>

        <Card shadow="none" className="border border-slate-200 bg-slate-50">
          <CardBody>
            <p className="text-xs text-slate-500">Sponsor</p>

            <p className="mt-1 text-xl font-bold text-slate-900">
              {campaign.sponsorCount}
            </p>
          </CardBody>
        </Card>

        <Card shadow="none" className="border border-slate-200 bg-slate-50">
          <CardBody>
            <p className="text-xs text-slate-500">Mulai</p>

            <p className="mt-1 text-sm font-bold text-slate-900">
              {formatDateTime(campaign.startAt)}
            </p>
          </CardBody>
        </Card>

        <Card shadow="none" className="border border-slate-200 bg-slate-50">
          <CardBody>
            <p className="text-xs text-slate-500">Berakhir</p>

            <p className="mt-1 text-sm font-bold text-slate-900">
              {formatDateTime(campaign.endAt)}
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
