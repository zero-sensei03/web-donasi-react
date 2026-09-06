import {
  addToast,
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
} from '@heroui/react';
import { Plus, RefreshCcw, Search, Trash2, Zap } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import CampaignTable from './CampaignTable';
import CampaignFormModal from './CampaignFormModal';
import CampaignDetailModal from './CampaignDetailModal';

import {
  createCampaign,
  deleteCampaign,
  getCampaigns,
  restoreCampaign,
  setActiveCampaign,
  updateCampaign,
} from '@/services/campaign/http';

import type {
  Campaign,
  CreateCampaignPayload,
} from '@/interfaces/campaign.interface';
import { useNavigate } from 'react-router-dom';

const LIMIT = 10;

type ConfirmationType = 'delete' | 'activate' | null;

export default function CampaignPage() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );

  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  const [confirmationType, setConfirmationType] =
    useState<ConfirmationType>(null);

  const [confirmationCampaign, setConfirmationCampaign] =
    useState<Campaign | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const campaignQuery = useQuery({
    queryKey: [
      'campaigns',
      {
        page,
        limit: LIMIT,
        search,
      },
    ],
    queryFn: () =>
      getCampaigns({
        page,
        limit: LIMIT,
        search,
      }),
    placeholderData: (previous) => previous,
  });

  const createMutation = useMutation({
    mutationFn: createCampaign,

    onSuccess: () => {
      addToast({
        title: 'Campaign berhasil dibuat',
        color: 'success',
      });

      setFormOpen(false);

      queryClient.invalidateQueries({
        queryKey: ['campaigns'],
      });
    },

    onError: (error: any) => {
      addToast({
        title: error?.response?.data?.message || 'Gagal membuat campaign',
        color: 'danger',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: CreateCampaignPayload;
    }) => updateCampaign(id, payload),

    onSuccess: () => {
      addToast({
        title: 'Campaign berhasil diperbarui',
        color: 'success',
      });

      setFormOpen(false);
      setEditingCampaign(null);

      queryClient.invalidateQueries({
        queryKey: ['campaigns'],
      });
    },

    onError: (error: any) => {
      addToast({
        title: error?.response?.data?.message || 'Gagal memperbarui campaign',
        color: 'danger',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCampaign,

    onSuccess: () => {
      addToast({
        title: 'Campaign berhasil dihapus',
        color: 'success',
      });

      queryClient.invalidateQueries({
        queryKey: ['campaigns'],
      });
    },

    onError: (error: any) => {
      addToast({
        title: error?.response?.data?.message || 'Gagal menghapus campaign',
        color: 'danger',
      });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: restoreCampaign,

    onSuccess: () => {
      addToast({
        title: 'Campaign berhasil direstore',
        color: 'success',
      });

      queryClient.invalidateQueries({
        queryKey: ['campaigns'],
      });
    },

    onError: (error: any) => {
      addToast({
        title: error?.response?.data?.message || 'Gagal restore campaign',
        color: 'danger',
      });
    },
  });

  const activateMutation = useMutation({
    mutationFn: setActiveCampaign,

    onSuccess: () => {
      addToast({
        title: 'Campaign berhasil diaktifkan',
        description: 'Campaign aktif sebelumnya otomatis dinonaktifkan.',
        color: 'success',
      });

      queryClient.invalidateQueries({
        queryKey: ['campaigns'],
      });
    },

    onError: (error: any) => {
      addToast({
        title: error?.response?.data?.message || 'Gagal mengaktifkan campaign',
        color: 'danger',
      });
    },
  });

  const handleSubmit = (payload: CreateCampaignPayload) => {
    if (editingCampaign) {
      updateMutation.mutate({
        id: editingCampaign.id,
        payload,
      });

      return;
    }

    createMutation.mutate(payload);
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormOpen(true);
  };

  const navigate = useNavigate();

  const handleDetail = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    navigate(`/admin/campaign/${campaign.id}`);
  };

  const handleDelete = (campaign: Campaign) => {
    setConfirmationCampaign(campaign);
    setConfirmationType('delete');
  };

  const handleRestore = (campaign: Campaign) => {
    const confirmed = window.confirm(`Restore campaign "${campaign.title}"?`);

    if (!confirmed) {
      return;
    }

    restoreMutation.mutate(campaign.id);
  };

  const handleActivate = (campaign: Campaign) => {
    setConfirmationCampaign(campaign);
    setConfirmationType('activate');
  };

  const closeConfirmationModal = () => {
    if (deleteMutation.isPending || activateMutation.isPending) {
      return;
    }

    setConfirmationType(null);
    setConfirmationCampaign(null);
  };

  const handleConfirmAction = () => {
    if (!confirmationCampaign || !confirmationType) {
      return;
    }

    if (confirmationType === 'delete') {
      deleteMutation.mutate(confirmationCampaign.id, {
        onSettled: () => {
          setConfirmationType(null);
          setConfirmationCampaign(null);
        },
      });

      return;
    }

    if (confirmationType === 'activate') {
      activateMutation.mutate(confirmationCampaign.id, {
        onSettled: () => {
          setConfirmationType(null);
          setConfirmationCampaign(null);
        },
      });
    }
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  const isConfirmationPending =
    deleteMutation.isPending || activateMutation.isPending;

  const isDeleteConfirmation = confirmationType === 'delete';
  const isActivateConfirmation = confirmationType === 'activate';

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Campaign</h1>

          <p className="mt-1 text-sm text-slate-500">
            Kelola campaign, periode, target donasi, dan status campaign.
          </p>
        </div>

        <Button
          color="primary"
          startContent={<Plus className="h-4 w-4" />}
          onPress={() => {
            setEditingCampaign(null);
            setFormOpen(true);
          }}
        >
          Tambah Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card shadow="none" className="border border-slate-200">
          <CardBody>
            <p className="text-sm text-slate-500">Total Campaign</p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {campaignQuery.data?.total ?? 0}
            </p>
          </CardBody>
        </Card>

        <Card shadow="none" className="border border-slate-200">
          <CardBody>
            <p className="text-sm text-slate-500">Campaign Aktif</p>

            <p className="mt-1 text-2xl font-bold text-green-600">
              {campaignQuery.data?.items.filter(
                (item) => item.status === 'ACTIVE'
              ).length ?? 0}
            </p>
          </CardBody>
        </Card>

        <Card shadow="none" className="border border-slate-200">
          <CardBody>
            <p className="text-sm text-slate-500">Halaman</p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {campaignQuery.data?.page ?? page}
            </p>
          </CardBody>
        </Card>
      </div>

      <Card shadow="none" className="border border-slate-200">
        <CardBody className="p-4 sm:p-6">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Input
              className="w-full md:max-w-sm"
              placeholder="Cari campaign..."
              value={searchInput}
              onValueChange={setSearchInput}
              startContent={<Search className="h-4 w-4 text-slate-400" />}
              isClearable
              onClear={() => setSearchInput('')}
            />

            <Button
              variant="flat"
              startContent={<RefreshCcw className="h-4 w-4" />}
              onPress={() => campaignQuery.refetch()}
              isLoading={campaignQuery.isFetching}
            >
              Refresh
            </Button>
          </div>

          {campaignQuery.isError ? (
            <div className="rounded-xl border border-danger-200 bg-danger-50 p-6 text-center">
              <p className="font-semibold text-danger-700">
                Gagal mengambil data campaign.
              </p>

              <Button
                className="mt-4"
                color="danger"
                variant="flat"
                onPress={() => campaignQuery.refetch()}
              >
                Coba Lagi
              </Button>
            </div>
          ) : (
            <>
              <CampaignTable
                data={campaignQuery.data?.items ?? []}
                isLoading={campaignQuery.isLoading}
                onDetail={handleDetail}
                onEdit={handleEdit}
                onActivate={handleActivate}
                onDelete={handleDelete}
                onRestore={handleRestore}
              />

              {(campaignQuery.data?.totalPages ?? 0) > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    page={page}
                    total={campaignQuery.data?.totalPages ?? 1}
                    onChange={setPage}
                    showControls
                  />
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>

      <CampaignFormModal
        isOpen={formOpen}
        onClose={() => {
          if (isMutating) {
            return;
          }

          setFormOpen(false);
          setEditingCampaign(null);
        }}
        campaign={editingCampaign}
        isSubmitting={isMutating}
        onSubmit={handleSubmit}
      />

      <CampaignDetailModal
        isOpen={detailOpen}
        campaign={selectedCampaign}
        onClose={() => {
          setDetailOpen(false);
          setSelectedCampaign(null);
        }}
      />

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmationType !== null}
        onOpenChange={(open) => {
          if (!open) {
            closeConfirmationModal();
          }
        }}
        placement="center"
        size="md"
        isDismissable={!isConfirmationPending}
        hideCloseButton={isConfirmationPending}
      >
        <ModalContent>
          <ModalHeader className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                isDeleteConfirmation
                  ? 'bg-danger-100 text-danger-600'
                  : 'bg-warning-100 text-warning-600'
              }`}
            >
              {isDeleteConfirmation ? (
                <Trash2 className="h-5 w-5" />
              ) : (
                <Zap className="h-5 w-5" />
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {isDeleteConfirmation ? 'Hapus Campaign' : 'Aktifkan Campaign'}
              </h2>

              <p className="mt-0.5 text-sm font-normal text-slate-500">
                Konfirmasi tindakan
              </p>
            </div>
          </ModalHeader>

          <ModalBody>
            {confirmationCampaign && isDeleteConfirmation && (
              <div className="space-y-3">
                <p className="text-sm leading-6 text-slate-600">
                  Apakah kamu yakin ingin menghapus campaign berikut?
                </p>

                <div className="rounded-xl border border-danger-200 bg-danger-50 p-4">
                  <p className="font-semibold text-danger-800">
                    {confirmationCampaign.title}
                  </p>

                  <p className="mt-1 text-xs text-danger-600">
                    Campaign yang dihapus tidak akan tersedia dalam daftar
                    campaign aktif.
                  </p>
                </div>

                <p className="text-xs text-slate-500">
                  Tindakan ini akan menghapus campaign dari sistem.
                </p>
              </div>
            )}

            {confirmationCampaign && isActivateConfirmation && (
              <div className="space-y-3">
                <p className="text-sm leading-6 text-slate-600">
                  Apakah kamu yakin ingin menjadikan campaign berikut sebagai
                  campaign aktif?
                </p>

                <div className="rounded-xl border border-warning-200 bg-warning-50 p-4">
                  <p className="font-semibold text-warning-800">
                    {confirmationCampaign.title}
                  </p>

                  <p className="mt-1 text-xs text-warning-600">
                    Campaign aktif sebelumnya akan otomatis dinonaktifkan.
                  </p>
                </div>

                <p className="text-xs text-slate-500">
                  Hanya satu campaign yang dapat menjadi campaign aktif pada
                  satu waktu.
                </p>
              </div>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              variant="flat"
              onPress={closeConfirmationModal}
              isDisabled={isConfirmationPending}
            >
              Batal
            </Button>

            <Button
              color={isDeleteConfirmation ? 'danger' : 'warning'}
              onPress={handleConfirmAction}
              isLoading={isConfirmationPending}
            >
              {isDeleteConfirmation ? 'Ya, Hapus' : 'Ya, Aktifkan'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
