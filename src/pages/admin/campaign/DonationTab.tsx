import type { Donation, DonationStatus } from '@/interfaces/donation.interface';
import {
  addToast,
  Button,
  Input,
  Pagination,
  Progress,
  Select,
  SelectItem,
  Skeleton,
} from '@heroui/react';
import { HeartHandshake, Plane, RefreshCcw, Search } from 'lucide-react';
import DonationTable from './DonationTable';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getDonationById,
  getDonationsByCampaign,
  updateDonationStatus,
} from '@/services/donation/http';
import DonationDetailModal from './DonationDetailModal';
import DonationApproveModal from './DonationApproveModal';
import { useGetCampaignDonationPublic } from '@/services/campaign';
import Users from '../users/Users';

const LIMIT = 10;
const formatRupiah = (val: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(val);
export const DonationTab = ({
  campaignId,
  activeTab,
}: {
  campaignId: string;
  activeTab: string;
}) => {
  const queryClient = useQueryClient();

  const { data: dataDonation, isLoading: isLoadingDonation } =
    useGetCampaignDonationPublic(campaignId);
  const donationStats = useMemo(() => {
    const target = dataDonation?.data.target || 1;
    const collected = dataDonation?.data.collected || 0;
    const percentage = Math.round((collected / target) * 100);
    const sponsor = dataDonation?.data.sponsor || 0;
    const donaturTotal = dataDonation?.data.donateCount || 0;

    return {
      target,
      collected,
      percentage,
      stats: [
        {
          label: 'Total Donasi',
          value: `Rp ${collected.toLocaleString('id-ID')}`,
          icon: HeartHandshake,
        },
        {
          label: 'Donatur',
          value: donaturTotal.toLocaleString('id-ID'),
          icon: Users,
        },
        {
          label: 'Sponsor',
          value: sponsor.toLocaleString('id-ID'),
          icon: Plane,
        },
      ],
    };
  }, [dataDonation]);

  const [page, setPage] = useState(1);

  useEffect(() => {
    if (activeTab === 'donations') {
      setPage(1);
    }
  }, [activeTab]);

  const [search, setSearch] = useState('');
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(
    null
  );
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState<DonationStatus | 'ALL'>('ALL');

  const [detailDonationOpen, setDetailDonationOpen] = useState(false);
  const [approveDonationOpen, setApproveDonationOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const donationQuery = useQuery({
    queryKey: [
      'campaign-donations',
      {
        campaignId: campaignId,
        page,
        limit: LIMIT,
        search,
        status,
      },
    ],

    queryFn: () =>
      getDonationsByCampaign({
        campaignId: campaignId!,
        page,
        limit: LIMIT,
        search,
        ...(status !== 'ALL' ? { status } : {}),
      }),

    enabled: Boolean(campaignId) && activeTab === 'donations',

    placeholderData: (previous) => previous,
  });

  const donationDetailQuery = useQuery({
    queryKey: ['donation', selectedDonation?.id],

    queryFn: () => getDonationById(selectedDonation!.id),

    enabled: Boolean(selectedDonation?.id) && detailDonationOpen,
  });

  const approveMutation = useMutation({
    mutationFn: ({
      donationId,
      status,
      amount,
      reply,
    }: {
      donationId: string;
      status: DonationStatus;
      amount?: number;
      reply?: string | null;
    }) =>
      updateDonationStatus(donationId, {
        status,
        amount,
        reply,
      }),

    onSuccess: () => {
      addToast({
        title: 'Status donasi berhasil diperbarui',
        color: 'success',
      });

      setApproveDonationOpen(false);
      setDetailDonationOpen(false);
      setSelectedDonation(null);

      queryClient.invalidateQueries({
        queryKey: ['campaign-donations'],
      });

      queryClient.invalidateQueries({
        queryKey: ['donation'],
      });
      queryClient.invalidateQueries({
        queryKey: ['campaign-donation', campaignId],
      });

      queryClient.invalidateQueries({
        queryKey: ['donation-public'],
      });
    },

    onError: (error: any) => {
      addToast({
        title:
          error?.response?.data?.message || 'Gagal memperbarui status donasi',
        color: 'danger',
      });
    },
  });

  const handleDonationDetail = (donation: Donation) => {
    setSelectedDonation(donation);
    setDetailDonationOpen(true);
  };

  const handleApprove = (donation: Donation) => {
    setSelectedDonation(donation);
    setApproveDonationOpen(true);
  };

  const donationForDetail = donationDetailQuery.data ?? selectedDonation;

  const handleApproveFromDetail = (donation: Donation) => {
    setSelectedDonation(donation);
    setApproveDonationOpen(true);
  };

  return (
    <>
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Donasi Campaign</h2>

          <p className="mt-1 text-sm text-slate-500">
            Kelola donasi yang masuk dan lakukan verifikasi pembayaran.
          </p>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="border border-atac-green-light bg-card/95 backdrop-blur-md rounded-xl shadow-md">
            {isLoadingDonation ? (
              <Skeleton className="h-20 md:min-w-xl w-full rounded-md" />
            ) : (
              <div className="p-6 sm:p-8">
                <div className="lg:items-center">
                  {/* Progress Bar Info */}
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Progress Pengumpulan Dana
                        </span>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                            {formatRupiah(donationStats.collected)}
                          </span>
                          <span className="text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
                            {donationStats.percentage}%
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Target:{' '}
                        <span className="font-bold text-foreground">
                          {formatRupiah(donationStats.target)}
                        </span>
                      </p>
                    </div>

                    <Progress
                      aria-label="Progress dukungan"
                      value={donationStats.percentage}
                      className="h-3"
                      classNames={{
                        track: 'bg-atac-green-light rounded-full',
                        indicator:
                          'bg-gradient-to-r from-atac-green-dark to-atac-green rounded-full',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              className="w-full sm:w-72"
              placeholder="Cari donatur atau pesan..."
              value={searchInput}
              onValueChange={setSearchInput}
              startContent={<Search className="h-4 w-4 text-slate-400" />}
              isClearable
              onClear={() => setSearchInput('')}
            />

            <Select
              className="w-full sm:w-48"
              label="Status"
              selectedKeys={[status]}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0];

                setStatus(value as DonationStatus | 'ALL');

                setPage(1);
              }}
            >
              <SelectItem key="ALL">Semua</SelectItem>

              <SelectItem key="PENDING">Menunggu</SelectItem>

              <SelectItem key="ACCEPTED">Diterima</SelectItem>

              <SelectItem key="REJECTED">Ditolak</SelectItem>
            </Select>
          </div>

          <Button
            variant="flat"
            startContent={<RefreshCcw className="h-4 w-4" />}
            onPress={() => donationQuery.refetch()}
            isLoading={donationQuery.isFetching}
          >
            Refresh
          </Button>
        </div>

        {donationQuery.isError ? (
          <div className="rounded-xl border border-danger-200 bg-danger-50 p-6 text-center">
            <p className="font-semibold text-danger-700">
              Gagal mengambil data donasi.
            </p>

            <Button
              className="mt-4"
              color="danger"
              variant="flat"
              onPress={() => donationQuery.refetch()}
            >
              Coba Lagi
            </Button>
          </div>
        ) : (
          <>
            <DonationTable
              data={donationQuery.data?.items ?? []}
              isLoading={donationQuery.isLoading}
              onDetail={handleDonationDetail}
              onApprove={handleApprove}
            />

            {(donationQuery.data?.totalPages ?? 0) > 1 && (
              <div className="flex justify-center pt-2">
                <Pagination
                  page={page}
                  total={donationQuery.data?.totalPages ?? 1}
                  onChange={setPage}
                  showControls
                />
              </div>
            )}
          </>
        )}
      </div>
      <DonationDetailModal
        isOpen={detailDonationOpen}
        donation={donationForDetail ?? null}
        onClose={() => {
          setDetailDonationOpen(false);
          setSelectedDonation(null);
        }}
        onApprove={handleApproveFromDetail}
      />

      <DonationApproveModal
        isOpen={approveDonationOpen}
        donation={selectedDonation}
        isSubmitting={approveMutation.isPending}
        onClose={() => {
          if (approveMutation.isPending) {
            return;
          }

          setApproveDonationOpen(false);
        }}
        onSubmit={(payload) => {
          if (!selectedDonation) {
            return;
          }

          approveMutation.mutate({
            donationId: selectedDonation.id,
            ...payload,
          });
        }}
      />
    </>
  );
};
