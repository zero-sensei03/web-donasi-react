import { Button, Card, CardBody, Chip, Tab, Tabs } from '@heroui/react';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getCampaignById } from '@/services/campaign/http';

import { getCampaignStatusLabel } from '@/utils/campaign';

import { OverviewTab } from './OverviewTab';
import { DonationTab } from './DonationTab';
import { ProposalTab } from './ProposalTab';
import { PaymentMethodTab } from './PaymentMethodTab';
import { ContactListTab } from './ContactListTab';
import { GalleryTab } from './GalleryTab';
import { AboutUsTab } from './AboutUsTab';
import { HomePageTab } from './HomePageTab';

export default function CampaignDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [activeTab, setActiveTab] = useState('overview');

  const campaignQuery = useQuery({
    queryKey: ['campaign', id],
    queryFn: () => getCampaignById(id!),
    enabled: Boolean(id),
  });

  const campaign = campaignQuery.data;

  if (campaignQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-32 animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-96 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    );
  }

  if (campaignQuery.isError || !campaign) {
    return (
      <div className="rounded-2xl border border-danger-200 bg-danger-50 p-8 text-center">
        <p className="font-semibold text-danger-700">
          Campaign tidak ditemukan.
        </p>

        <Button
          className="mt-4"
          color="danger"
          variant="flat"
          onPress={() => navigate('/admin/campaigns')}
        >
          Kembali
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <Button
          className="w-fit"
          variant="light"
          startContent={<ArrowLeft className="h-4 w-4" />}
          onPress={() => navigate('/admin/campaigns')}
        >
          Kembali ke Campaign
        </Button>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">
              {campaign.title}
            </h1>

            <Chip
              size="sm"
              variant="flat"
              color={campaign.status === 'ACTIVE' ? 'success' : 'default'}
            >
              {getCampaignStatusLabel(campaign.status)}
            </Chip>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Kelola seluruh konten dan data campaign.
          </p>
        </div>
      </div>

      <Card shadow="none" className="border border-slate-200">
        <CardBody className="p-0">
          <Tabs
            aria-label="Campaign detail tabs"
            selectedKey={activeTab}
            onSelectionChange={(key) => {
              setActiveTab(String(key));
            }}
            classNames={{
              base: 'px-4 pt-2 sm:px-6',
              tabList: 'gap-6 w-full relative border border-divider rounded-lg',
              panel: 'sm:p-6 p-4',
              cursor: 'w-full',
            }}
          >
            <Tab key="overview" title="Overview">
              <OverviewTab campaign={campaign} />
            </Tab>

            <Tab key="donations" title="Donasi">
              <DonationTab
                campaignId={id || campaign.id}
                activeTab={activeTab}
              />
            </Tab>

            <Tab key="proposal" title="Proposal">
              <ProposalTab
                campaignId={id || campaign.id}
                activeTab={activeTab}
              />
            </Tab>

            <Tab key="homepage" title="Homepage">
              <HomePageTab
                campaignId={id || campaign.id}
                activeTab={activeTab}
              />
            </Tab>

            <Tab key="about-us" title="About Us">
              <AboutUsTab
                campaignId={id || campaign.id}
                activeTab={activeTab}
              />
            </Tab>

            <Tab key="payment" title="Payment Method">
              <PaymentMethodTab
                campaignId={id || campaign.id}
                activeTab={activeTab}
              />
            </Tab>

            <Tab key="gallery" title="Gallery">
              <GalleryTab
                campaignId={id || campaign.id}
                activeTab={activeTab}
              />
            </Tab>

            <Tab key="contact" title="Contact">
              <ContactListTab
                campaignId={id || campaign.id}
                activeTab={activeTab}
              />
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}
