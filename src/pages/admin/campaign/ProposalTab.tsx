import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Select,
  SelectItem,
  Skeleton,
  Textarea,
  useDisclosure,
} from '@heroui/react';
import {
  Edit,
  ExternalLink,
  FileText,
  Plus,
  Search,
  Trash2,
  Upload,
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addToast } from '@heroui/react';

import {
  createProposal,
  deleteProposal,
  getProposals,
  updateProposal,
} from '@/services/proposal/http';
import type {
  CampaignProposal,
  ProposalStatus,
} from '@/interfaces/proposal.interface';
import { formatDateTime } from '@/utils/date';

interface ProposalTabProps {
  campaignId: string;
  activeTab: string;
}

const LIMIT = 10;

const statusColor: Record<ProposalStatus, 'default' | 'success' | 'warning'> = {
  DRAFT: 'warning',
  PUBLISHED: 'success',
  ARCHIVED: 'default',
};

const statusLabel: Record<ProposalStatus, string> = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  ARCHIVED: 'Archived',
};

interface FormState {
  title: string;
  description: string;
  status: ProposalStatus;
  proposal: File | null;
}

const initialForm: FormState = {
  title: '',
  description: '',
  status: 'DRAFT',
  proposal: null,
};

export const ProposalTab = ({ campaignId, activeTab }: ProposalTabProps) => {
  const queryClient = useQueryClient();

  const formModal = useDisclosure();
  const deleteModal = useDisclosure();

  const [page, setPage] = useState(1);
  useEffect(() => {
    if (activeTab === 'proposal') {
      setPage(1);
    }
  }, [activeTab]);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const [editingProposal, setEditingProposal] =
    useState<CampaignProposal | null>(null);

  const [deletingProposal, setDeletingProposal] =
    useState<CampaignProposal | null>(null);

  const [form, setForm] = useState<FormState>(initialForm);

  const proposalQuery = useQuery({
    queryKey: ['campaign-proposals', campaignId, page, LIMIT, search, status],
    queryFn: () =>
      getProposals({
        campaignId,
        page,
        limit: LIMIT,
        search,
        status,
      }),
    enabled: Boolean(campaignId),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ['campaign-proposals', campaignId],
    });
    queryClient.invalidateQueries({
      queryKey: ['proposal-campaign'],
    });
  };

  const createMutation = useMutation({
    mutationFn: () =>
      createProposal({
        campaignId,
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        proposal: form.proposal,
      }),
    onSuccess: () => {
      addToast({
        title: 'Berhasil',
        description: 'Proposal berhasil dibuat.',
        color: 'success',
      });

      formModal.onClose();
      setForm(initialForm);
      invalidate();
    },
    onError: (error: any) => {
      addToast({
        title: 'Gagal',
        description: error?.response?.data?.message || 'Proposal gagal dibuat.',
        color: 'danger',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: () => {
      if (!editingProposal) {
        throw new Error('Proposal tidak ditemukan');
      }

      return updateProposal(editingProposal.id, {
        campaignId,
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        proposal: form.proposal,
      });
    },
    onSuccess: () => {
      addToast({
        title: 'Berhasil',
        description: 'Proposal berhasil diperbarui.',
        color: 'success',
      });

      formModal.onClose();
      setEditingProposal(null);
      setForm(initialForm);
      invalidate();
    },
    onError: (error: any) => {
      addToast({
        title: 'Gagal',
        description:
          error?.response?.data?.message || 'Proposal gagal diperbarui.',
        color: 'danger',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!deletingProposal) {
        throw new Error('Proposal tidak ditemukan');
      }

      return deleteProposal(deletingProposal.id);
    },
    onSuccess: () => {
      addToast({
        title: 'Berhasil',
        description: 'Proposal berhasil dihapus.',
        color: 'success',
      });

      deleteModal.onClose();
      setDeletingProposal(null);

      if (
        proposalQuery.data &&
        proposalQuery.data.items.length === 1 &&
        page > 1
      ) {
        setPage((current) => current - 1);
      } else {
        invalidate();
      }
    },
    onError: (error: any) => {
      addToast({
        title: 'Gagal',
        description:
          error?.response?.data?.message || 'Proposal gagal dihapus.',
        color: 'danger',
      });
    },
  });

  const proposals = proposalQuery.data?.items ?? [];
  const totalPages = proposalQuery.data?.totalPages ?? 1;

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput.trim());
  };

  const openCreate = () => {
    setEditingProposal(null);
    setForm(initialForm);
    formModal.onOpen();
  };

  const openEdit = (proposal: CampaignProposal) => {
    setEditingProposal(proposal);

    setForm({
      title: proposal.title,
      description: proposal.description,
      status: proposal.status,
      proposal: null,
    });

    formModal.onOpen();
  };

  const handleSubmit = () => {
    if (!form.title.trim()) {
      addToast({
        title: 'Validasi',
        description: 'Title wajib diisi.',
        color: 'warning',
      });
      return;
    }

    if (!form.description.trim()) {
      addToast({
        title: 'Validasi',
        description: 'Description wajib diisi.',
        color: 'warning',
      });
      return;
    }

    if (!editingProposal && !form.proposal) {
      addToast({
        title: 'Validasi',
        description: 'File proposal PDF wajib dipilih.',
        color: 'warning',
      });
      return;
    }

    if (editingProposal) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== 'application/pdf') {
      addToast({
        title: 'File tidak valid',
        description: 'Proposal harus berupa file PDF.',
        color: 'danger',
      });

      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast({
        title: 'File terlalu besar',
        description: 'Ukuran proposal maksimal 5 MB.',
        color: 'danger',
      });

      event.target.value = '';
      return;
    }

    setForm((current) => ({
      ...current,
      proposal: file,
    }));
  };

  const tableRows = useMemo(() => {
    if (proposalQuery.isLoading) {
      return Array.from({ length: 5 });
    }

    return proposals;
  }, [proposalQuery.isLoading, proposals]);

  return (
    <>
      <Card shadow="none" className="border border-slate-200 bg-white">
        <CardBody className="p-0">
          <div className="border-b border-slate-200 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Proposal</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Kelola proposal kegiatan untuk campaign ini.
                </p>
              </div>

              <Button
                color="success"
                startContent={<Plus size={18} />}
                onPress={openCreate}
              >
                Tambah Proposal
              </Button>
            </div>

            <div className="mt-5 flex flex-col gap-3 lg:flex-row">
              <Input
                value={searchInput}
                onValueChange={setSearchInput}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleSearch();
                  }
                }}
                placeholder="Cari proposal..."
                startContent={<Search size={18} className="text-slate-400" />}
                className="lg:max-w-md"
              />

              <Select
                selectedKeys={status ? [status] : []}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0]?.toString() ?? '';
                  setStatus(value);
                  setPage(1);
                }}
                placeholder="Semua Status"
                className="lg:w-48"
              >
                <SelectItem key="DRAFT">Draft</SelectItem>
                <SelectItem key="PUBLISHED">Published</SelectItem>
                <SelectItem key="ARCHIVED">Archived</SelectItem>
              </Select>

              <Button variant="flat" onPress={handleSearch}>
                Cari
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Proposal
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Status
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Dibuat
                  </th>
                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase text-slate-500">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {proposalQuery.isLoading &&
                  tableRows.map((_, index) => (
                    <tr key={index} className="border-b border-slate-100">
                      <td className="px-5 py-4">
                        <Skeleton className="h-5 w-64 rounded-lg" />
                        <Skeleton className="mt-2 h-4 w-96 rounded-lg" />
                      </td>
                      <td className="px-5 py-4">
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </td>
                      <td className="px-5 py-4">
                        <Skeleton className="h-4 w-36 rounded-lg" />
                      </td>
                      <td className="px-5 py-4">
                        <Skeleton className="ml-auto h-8 w-28 rounded-lg" />
                      </td>
                    </tr>
                  ))}

                {!proposalQuery.isLoading && proposals.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-16 text-center">
                      <FileText size={42} className="mx-auto text-slate-300" />
                      <p className="mt-3 font-semibold text-slate-700">
                        Belum ada proposal
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Proposal campaign akan muncul di sini.
                      </p>
                    </td>
                  </tr>
                )}

                {!proposalQuery.isLoading &&
                  proposals.map((proposal) => (
                    <tr
                      key={proposal.id}
                      className="border-b border-slate-100 transition-colors hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {proposal.title}
                        </p>
                        <p className="mt-1 max-w-xl truncate text-sm text-slate-500">
                          {proposal.description}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <Chip
                          size="sm"
                          variant="flat"
                          color={statusColor[proposal.status]}
                        >
                          {statusLabel[proposal.status]}
                        </Chip>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatDateTime(proposal.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            as="a"
                            href={proposal.proposalPdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="sm"
                            variant="flat"
                            startContent={<ExternalLink size={15} />}
                          >
                            PDF
                          </Button>

                          <Button
                            size="sm"
                            variant="flat"
                            startContent={<Edit size={15} />}
                            onPress={() => openEdit(proposal)}
                          >
                            Edit
                          </Button>

                          <Button
                            size="sm"
                            color="danger"
                            variant="flat"
                            startContent={<Trash2 size={15} />}
                            onPress={() => {
                              setDeletingProposal(proposal);
                              deleteModal.onOpen();
                            }}
                          >
                            Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {!proposalQuery.isLoading &&
            proposals.length > 0 &&
            totalPages > 1 && (
              <div className="flex justify-center border-t border-slate-200 p-5">
                <Pagination
                  page={page}
                  total={totalPages}
                  onChange={setPage}
                  showControls
                />
              </div>
            )}
        </CardBody>
      </Card>

      <Modal
        isOpen={formModal.isOpen}
        onOpenChange={formModal.onOpenChange}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>
            {editingProposal ? 'Edit Proposal' : 'Tambah Proposal'}
          </ModalHeader>

          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Title"
                placeholder="Masukkan title proposal"
                value={form.title}
                onValueChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    title: value,
                  }))
                }
                isRequired
              />

              <Textarea
                label="Description"
                placeholder="Masukkan deskripsi proposal"
                value={form.description}
                onValueChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    description: value,
                  }))
                }
                minRows={5}
                isRequired
              />

              <Select
                label="Status"
                selectedKeys={[form.status]}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as ProposalStatus;

                  setForm((current) => ({
                    ...current,
                    status: value,
                  }));
                }}
              >
                <SelectItem key="DRAFT">Draft</SelectItem>
                <SelectItem key="PUBLISHED">Published</SelectItem>
                <SelectItem key="ARCHIVED">Archived</SelectItem>
              </Select>

              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">
                  File Proposal{' '}
                  {!editingProposal && <span className="text-danger">*</span>}
                </p>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 p-4 transition hover:border-green-500 hover:bg-green-50/30">
                  <Upload size={22} className="text-slate-400" />

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700">
                      {form.proposal
                        ? form.proposal.name
                        : editingProposal
                          ? 'Pilih PDF baru jika ingin mengganti'
                          : 'Pilih file PDF'}
                    </p>

                    <p className="text-xs text-slate-500">PDF, maksimal 5 MB</p>
                  </div>

                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="flat"
              onPress={formModal.onClose}
              isDisabled={isSubmitting}
            >
              Batal
            </Button>

            <Button
              color="success"
              onPress={handleSubmit}
              isLoading={isSubmitting}
            >
              {editingProposal ? 'Simpan Perubahan' : 'Tambah Proposal'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={deleteModal.isOpen}
        onOpenChange={deleteModal.onOpenChange}
        size="sm"
      >
        <ModalContent>
          <ModalHeader>Hapus Proposal</ModalHeader>

          <ModalBody>
            <p className="text-sm text-slate-600">
              Yakin ingin menghapus proposal{' '}
              <strong>{deletingProposal?.title}</strong>?
            </p>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="flat"
              onPress={deleteModal.onClose}
              isDisabled={deleteMutation.isPending}
            >
              Batal
            </Button>

            <Button
              color="danger"
              onPress={() => deleteMutation.mutate()}
              isLoading={deleteMutation.isPending}
            >
              Hapus
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
