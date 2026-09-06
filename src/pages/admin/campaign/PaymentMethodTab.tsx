import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Chip,
  Image,
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
import { addToast } from '@heroui/react';
import { Edit, ImageIcon, Plus, Search, Trash2, Upload } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createPaymentMethod,
  deletePaymentMethod,
  getPaymentMethods,
  updatePaymentMethod,
} from '@/services//payment/http';
import type {
  PaymentMethod,
  PaymentMethodType,
} from '@/interfaces/payment.interface';
import { formatDateTime } from '@/utils/date';

interface PaymentMethodTabProps {
  campaignId: string;
  activeTab: string;
}

const LIMIT = 10;

interface FormState {
  name: string;
  description: string;
  bankName: string;
  accountNumber: string;
  type: PaymentMethodType;
  qris: File | null;
}

const initialForm: FormState = {
  name: '',
  description: '',
  bankName: '',
  accountNumber: '',
  type: 'BANK_TRANSFER',
  qris: null,
};

export const PaymentMethodTab = ({
  campaignId,
  activeTab,
}: PaymentMethodTabProps) => {
  const queryClient = useQueryClient();

  const formModal = useDisclosure();
  const deleteModal = useDisclosure();

  const [page, setPage] = useState(1);
  useEffect(() => {
    if (activeTab === 'payment') {
      setPage(1);
    }
  }, [activeTab]);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');

  const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(
    null
  );

  const [deletingPayment, setDeletingPayment] = useState<PaymentMethod | null>(
    null
  );

  const [form, setForm] = useState<FormState>(initialForm);

  const paymentQuery = useQuery({
    queryKey: [
      'campaign-payment-methods',
      campaignId,
      page,
      LIMIT,
      search,
      type,
    ],
    queryFn: () =>
      getPaymentMethods({
        campaignId,
        page,
        limit: LIMIT,
        search,
        type,
      }),
    enabled: Boolean(campaignId),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ['campaign-payment-methods', campaignId],
    });
    queryClient.invalidateQueries({
      queryKey: ['payment-public'],
    });
  };

  const createMutation = useMutation({
    mutationFn: () =>
      createPaymentMethod({
        campaignId,
        name: form.name.trim(),
        description: form.description.trim(),
        bankName: form.bankName.trim(),
        accountNumber: form.accountNumber.trim(),
        type: form.type,
        qris: form.qris,
      }),
    onSuccess: () => {
      addToast({
        title: 'Berhasil',
        description: 'Payment method berhasil dibuat.',
        color: 'success',
      });

      formModal.onClose();
      setForm(initialForm);
      invalidate();
    },
    onError: (error: any) => {
      addToast({
        title: 'Gagal',
        description:
          error?.response?.data?.message || 'Payment method gagal dibuat.',
        color: 'danger',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: () => {
      if (!editingPayment) {
        throw new Error('Payment method tidak ditemukan');
      }

      return updatePaymentMethod(editingPayment.id, {
        campaignId,
        name: form.name.trim(),
        description: form.description.trim(),
        bankName: form.bankName.trim(),
        accountNumber: form.accountNumber.trim(),
        type: form.type,
        qris: form.qris,
      });
    },
    onSuccess: () => {
      addToast({
        title: 'Berhasil',
        description: 'Payment method berhasil diperbarui.',
        color: 'success',
      });

      formModal.onClose();
      setEditingPayment(null);
      setForm(initialForm);
      invalidate();
    },
    onError: (error: any) => {
      addToast({
        title: 'Gagal',
        description:
          error?.response?.data?.message || 'Payment method gagal diperbarui.',
        color: 'danger',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!deletingPayment) {
        throw new Error('Payment method tidak ditemukan');
      }

      return deletePaymentMethod(deletingPayment.id);
    },
    onSuccess: () => {
      addToast({
        title: 'Berhasil',
        description: 'Payment method berhasil dihapus.',
        color: 'success',
      });

      deleteModal.onClose();
      setDeletingPayment(null);

      if (
        paymentQuery.data &&
        paymentQuery.data.items.length === 1 &&
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
          error?.response?.data?.message || 'Payment method gagal dihapus.',
        color: 'danger',
      });
    },
  });

  const payments = paymentQuery.data?.items ?? [];
  const totalPages = paymentQuery.data?.totalPages ?? 1;

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput.trim());
  };

  const openCreate = () => {
    setEditingPayment(null);
    setForm(initialForm);
    formModal.onOpen();
  };

  const openEdit = (payment: PaymentMethod) => {
    setEditingPayment(payment);

    setForm({
      name: payment.name,
      description: payment.description ?? '',
      bankName: payment.bankName ?? '',
      accountNumber: payment.accountNumber ?? '',
      type: payment.type,
      qris: null,
    });

    formModal.onOpen();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      addToast({
        title: 'File tidak valid',
        description: 'QRIS harus JPG, PNG, atau WEBP.',
        color: 'danger',
      });

      event.target.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      addToast({
        title: 'File terlalu besar',
        description: 'Ukuran QRIS maksimal 2 MB.',
        color: 'danger',
      });

      event.target.value = '';
      return;
    }

    setForm((current) => ({
      ...current,
      qris: file,
    }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      addToast({
        title: 'Validasi',
        description: 'Nama pemilik wajib diisi.',
        color: 'warning',
      });
      return;
    }

    if (form.type === 'BANK_TRANSFER' && !form.bankName.trim()) {
      addToast({
        title: 'Validasi',
        description: 'Nama bank wajib diisi.',
        color: 'warning',
      });
      return;
    }

    if (form.type === 'BANK_TRANSFER' && !form.accountNumber.trim()) {
      addToast({
        title: 'Validasi',
        description: 'Nomor rekening wajib diisi.',
        color: 'warning',
      });
      return;
    }

    if (form.type === 'QRIS' && !editingPayment && !form.qris) {
      addToast({
        title: 'Validasi',
        description: 'Gambar QRIS wajib dipilih.',
        color: 'warning',
      });
      return;
    }

    if (editingPayment) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  const rows = useMemo(() => {
    if (paymentQuery.isLoading) {
      return Array.from({ length: 5 });
    }

    return payments;
  }, [paymentQuery.isLoading, payments]);

  return (
    <>
      <Card shadow="none" className="border border-slate-200 bg-white">
        <CardBody className="p-0">
          <div className="border-b border-slate-200 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Payment Method
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Kelola rekening dan QRIS untuk campaign ini.
                </p>
              </div>

              <Button
                color="success"
                startContent={<Plus size={18} />}
                onPress={openCreate}
              >
                Tambah Payment
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
                placeholder="Cari payment method..."
                startContent={<Search size={18} className="text-slate-400" />}
                className="lg:max-w-md"
              />

              <Select
                selectedKeys={type ? [type] : []}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0]?.toString() ?? '';
                  setType(value);
                  setPage(1);
                }}
                placeholder="Semua Tipe"
                className="lg:w-56"
              >
                <SelectItem key="QRIS">QRIS</SelectItem>
                <SelectItem key="BANK_TRANSFER">Bank Transfer</SelectItem>
              </Select>

              <Button variant="flat" onPress={handleSearch}>
                Cari
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Pemilik
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Tipe
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Bank / Rekening
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    QRIS
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
                {paymentQuery.isLoading &&
                  rows.map((_, index) => (
                    <tr key={index} className="border-b border-slate-100">
                      <td className="px-5 py-4">
                        <Skeleton className="h-5 w-40 rounded-lg" />
                      </td>
                      <td className="px-5 py-4">
                        <Skeleton className="h-6 w-28 rounded-full" />
                      </td>
                      <td className="px-5 py-4">
                        <Skeleton className="h-5 w-44 rounded-lg" />
                      </td>
                      <td className="px-5 py-4">
                        <Skeleton className="h-12 w-12 rounded-lg" />
                      </td>
                      <td className="px-5 py-4">
                        <Skeleton className="h-4 w-36 rounded-lg" />
                      </td>
                      <td className="px-5 py-4">
                        <Skeleton className="ml-auto h-8 w-28 rounded-lg" />
                      </td>
                    </tr>
                  ))}

                {!paymentQuery.isLoading && payments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center">
                      <ImageIcon size={42} className="mx-auto text-slate-300" />

                      <p className="mt-3 font-semibold text-slate-700">
                        Belum ada payment method
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Rekening atau QRIS campaign akan muncul di sini.
                      </p>
                    </td>
                  </tr>
                )}

                {!paymentQuery.isLoading &&
                  payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {payment.name}
                        </p>

                        {payment.description && (
                          <p className="mt-1 max-w-xs truncate text-sm text-slate-500">
                            {payment.description}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <Chip
                          size="sm"
                          variant="flat"
                          color={
                            payment.type === 'QRIS' ? 'success' : 'primary'
                          }
                        >
                          {payment.type === 'QRIS' ? 'QRIS' : 'Bank Transfer'}
                        </Chip>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-700">
                        {payment.type === 'BANK_TRANSFER' ? (
                          <>
                            <p className="font-medium">
                              {payment.bankName || '-'}
                            </p>
                            <p className="text-slate-500">
                              {payment.accountNumber || '-'}
                            </p>
                          </>
                        ) : (
                          '-'
                        )}
                      </td>

                      <td className="px-5 py-4">
                        {payment.qrisImage ? (
                          <a
                            href={payment.qrisImage}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Image
                              src={payment.qrisImage}
                              alt="QRIS"
                              className="h-14 w-14 rounded-lg object-cover"
                            />
                          </a>
                        ) : (
                          <span className="text-sm text-slate-400">-</span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatDateTime(payment.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="flat"
                            startContent={<Edit size={15} />}
                            onPress={() => openEdit(payment)}
                          >
                            Edit
                          </Button>

                          <Button
                            size="sm"
                            color="danger"
                            variant="flat"
                            startContent={<Trash2 size={15} />}
                            onPress={() => {
                              setDeletingPayment(payment);
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

          {!paymentQuery.isLoading && payments.length > 0 && totalPages > 1 && (
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
            {editingPayment ? 'Edit Payment Method' : 'Tambah Payment Method'}
          </ModalHeader>

          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Nama Pemilik"
                placeholder="Contoh: Universitas XYZ"
                value={form.name}
                onValueChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    name: value,
                  }))
                }
                isRequired
              />

              <Select
                label="Tipe"
                selectedKeys={[form.type]}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as PaymentMethodType;

                  setForm((current) => ({
                    ...current,
                    type: value,
                  }));
                }}
                isRequired
              >
                <SelectItem key="BANK_TRANSFER">Bank Transfer</SelectItem>
                <SelectItem key="QRIS">QRIS</SelectItem>
              </Select>

              {form.type === 'BANK_TRANSFER' && (
                <>
                  <Input
                    label="Nama Bank"
                    placeholder="Contoh: BCA"
                    value={form.bankName}
                    onValueChange={(value) =>
                      setForm((current) => ({
                        ...current,
                        bankName: value,
                      }))
                    }
                    isRequired
                  />

                  <Input
                    label="Nomor Rekening"
                    placeholder="Contoh: 1234567890"
                    value={form.accountNumber}
                    onValueChange={(value) =>
                      setForm((current) => ({
                        ...current,
                        accountNumber: value,
                      }))
                    }
                    isRequired
                  />
                </>
              )}

              <Textarea
                label="Deskripsi"
                placeholder="Deskripsi tambahan"
                value={form.description}
                onValueChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    description: value,
                  }))
                }
              />

              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">
                  QRIS{' '}
                  {form.type === 'QRIS' && !editingPayment && (
                    <span className="text-danger">*</span>
                  )}
                </p>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 p-4 transition hover:border-green-500 hover:bg-green-50/30">
                  <Upload size={22} className="text-slate-400" />

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700">
                      {form.qris
                        ? form.qris.name
                        : editingPayment
                          ? 'Pilih gambar baru jika ingin mengganti'
                          : 'Pilih gambar QRIS'}
                    </p>

                    <p className="text-xs text-slate-500">
                      JPG, PNG, WEBP maksimal 2 MB
                    </p>
                  </div>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>

                {editingPayment?.qrisImage && !form.qris && (
                  <div className="mt-3">
                    <Image
                      src={editingPayment.qrisImage}
                      alt="Current QRIS"
                      className="h-32 w-32 rounded-xl object-cover"
                    />
                  </div>
                )}
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
              {editingPayment ? 'Simpan Perubahan' : 'Tambah'}
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
          <ModalHeader>Hapus Payment Method</ModalHeader>

          <ModalBody>
            <p className="text-sm text-slate-600">
              Yakin ingin menghapus payment method{' '}
              <strong>{deletingPayment?.name}</strong>?
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
