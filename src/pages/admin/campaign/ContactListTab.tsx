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
  useDisclosure,
} from '@heroui/react';
import { addToast } from '@heroui/react';
import { Edit, MessageCircle, Plus, Search, Send, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createContact,
  deleteContact,
  getContactList,
  updateContact,
} from '@/services/contact-list/http';
import type {
  ContactList,
  ContactType,
} from '@/interfaces/contact-list.interface';
import { formatDateTime } from '@/utils/date';

interface ContactListTabProps {
  campaignId: string;
  activeTab: string;
}

const LIMIT = 10;

interface FormState {
  name: string;
  role: string;
  phone: string;
  type: ContactType;
}

const initialForm: FormState = {
  name: '',
  role: '',
  phone: '',
  type: 'WHATSAPP',
};

export const ContactListTab = ({
  campaignId,
  activeTab,
}: ContactListTabProps) => {
  const queryClient = useQueryClient();

  const formModal = useDisclosure();
  const deleteModal = useDisclosure();

  const [page, setPage] = useState(1);
  useEffect(() => {
    if (activeTab === 'contact') {
      setPage(1);
    }
  }, [activeTab]);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');

  const [editingContact, setEditingContact] = useState<ContactList | null>(
    null
  );

  const [deletingContact, setDeletingContact] = useState<ContactList | null>(
    null
  );

  const [form, setForm] = useState<FormState>(initialForm);

  const contactQuery = useQuery({
    queryKey: ['campaign-contact-list', campaignId, page, LIMIT, search, type],
    queryFn: () =>
      getContactList({
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
      queryKey: ['campaign-contact-list', campaignId],
    });
    queryClient.invalidateQueries({
      queryKey: ['contact-list-campaign'],
    });
  };

  const createMutation = useMutation({
    mutationFn: () =>
      createContact({
        campaignId,
        name: form.name.trim(),
        role: form.role.trim(),
        phone: form.phone.trim(),
        type: form.type,
      }),
    onSuccess: () => {
      addToast({
        title: 'Berhasil',
        description: 'Contact berhasil dibuat.',
        color: 'success',
      });

      formModal.onClose();
      setForm(initialForm);
      invalidate();
    },
    onError: (error: any) => {
      addToast({
        title: 'Gagal',
        description: error?.response?.data?.message || 'Contact gagal dibuat.',
        color: 'danger',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: () => {
      if (!editingContact) {
        throw new Error('Contact tidak ditemukan');
      }

      return updateContact(editingContact.id, {
        campaignId,
        name: form.name.trim(),
        role: form.role.trim(),
        phone: form.phone.trim(),
        type: form.type,
      });
    },
    onSuccess: () => {
      addToast({
        title: 'Berhasil',
        description: 'Contact berhasil diperbarui.',
        color: 'success',
      });

      formModal.onClose();
      setEditingContact(null);
      setForm(initialForm);
      invalidate();
    },
    onError: (error: any) => {
      addToast({
        title: 'Gagal',
        description:
          error?.response?.data?.message || 'Contact gagal diperbarui.',
        color: 'danger',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!deletingContact) {
        throw new Error('Contact tidak ditemukan');
      }

      return deleteContact(deletingContact.id);
    },
    onSuccess: () => {
      addToast({
        title: 'Berhasil',
        description: 'Contact berhasil dihapus.',
        color: 'success',
      });

      deleteModal.onClose();
      setDeletingContact(null);

      if (
        contactQuery.data &&
        contactQuery.data.items.length === 1 &&
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
        description: error?.response?.data?.message || 'Contact gagal dihapus.',
        color: 'danger',
      });
    },
  });

  const contacts = contactQuery.data?.items ?? [];
  const totalPages = contactQuery.data?.totalPages ?? 1;

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput.trim());
  };

  const openCreate = () => {
    setEditingContact(null);
    setForm(initialForm);
    formModal.onOpen();
  };

  const openEdit = (contact: ContactList) => {
    setEditingContact(contact);

    setForm({
      name: contact.name,
      role: contact.role,
      phone: contact.phone,
      type: contact.type,
    });

    formModal.onOpen();
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      addToast({
        title: 'Validasi',
        description: 'Nama contact wajib diisi.',
        color: 'warning',
      });
      return;
    }

    if (!form.role.trim()) {
      addToast({
        title: 'Validasi',
        description: 'Role/fungsi contact wajib diisi.',
        color: 'warning',
      });
      return;
    }

    if (!form.phone.trim()) {
      addToast({
        title: 'Validasi',
        description: 'Telepon/username wajib diisi.',
        color: 'warning',
      });
      return;
    }

    if (editingContact) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  const rows = useMemo(() => {
    if (contactQuery.isLoading) {
      return Array.from({ length: 5 });
    }

    return contacts;
  }, [contactQuery.isLoading, contacts]);

  return (
    <>
      <Card shadow="none" className="border border-slate-200 bg-white">
        <CardBody className="p-0">
          <div className="border-b border-slate-200 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Contact List
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Kelola kontak WhatsApp dan Telegram campaign.
                </p>
              </div>

              <Button
                color="success"
                startContent={<Plus size={18} />}
                onPress={openCreate}
              >
                Tambah Contact
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
                placeholder="Cari contact..."
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
                className="lg:w-48"
              >
                <SelectItem key="WHATSAPP">WhatsApp</SelectItem>

                <SelectItem key="TELEGRAM">Telegram</SelectItem>
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
                    Contact
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Fungsi
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Tipe
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
                {contactQuery.isLoading &&
                  rows.map((_, index) => (
                    <tr key={index} className="border-b border-slate-100">
                      <td className="px-5 py-4">
                        <Skeleton className="h-5 w-40 rounded-lg" />
                        <Skeleton className="mt-2 h-4 w-32 rounded-lg" />
                      </td>

                      <td className="px-5 py-4">
                        <Skeleton className="h-5 w-40 rounded-lg" />
                      </td>

                      <td className="px-5 py-4">
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </td>

                      <td className="px-5 py-4">
                        <Skeleton className="h-4 w-36 rounded-lg" />
                      </td>

                      <td className="px-5 py-4">
                        <Skeleton className="ml-auto h-8 w-28 rounded-lg" />
                      </td>
                    </tr>
                  ))}

                {!contactQuery.isLoading && contacts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center">
                      <MessageCircle
                        size={42}
                        className="mx-auto text-slate-300"
                      />

                      <p className="mt-3 font-semibold text-slate-700">
                        Belum ada contact
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Contact campaign akan muncul di sini.
                      </p>
                    </td>
                  </tr>
                )}

                {!contactQuery.isLoading &&
                  contacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {contact.name}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {contact.phone}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-700">
                        {contact.role}
                      </td>

                      <td className="px-5 py-4">
                        <Chip
                          size="sm"
                          variant="flat"
                          color={
                            contact.type === 'WHATSAPP' ? 'success' : 'primary'
                          }
                          startContent={
                            contact.type === 'WHATSAPP' ? (
                              <MessageCircle size={14} />
                            ) : (
                              <Send size={14} />
                            )
                          }
                        >
                          {contact.type === 'WHATSAPP'
                            ? 'WhatsApp'
                            : 'Telegram'}
                        </Chip>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatDateTime(contact.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="flat"
                            startContent={<Edit size={15} />}
                            onPress={() => openEdit(contact)}
                          >
                            Edit
                          </Button>

                          <Button
                            size="sm"
                            color="danger"
                            variant="flat"
                            startContent={<Trash2 size={15} />}
                            onPress={() => {
                              setDeletingContact(contact);
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

          {!contactQuery.isLoading && contacts.length > 0 && totalPages > 1 && (
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
        size="lg"
      >
        <ModalContent>
          <ModalHeader>
            {editingContact ? 'Edit Contact' : 'Tambah Contact'}
          </ModalHeader>

          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Nama"
                placeholder="Contoh: Admin Donasi"
                value={form.name}
                onValueChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    name: value,
                  }))
                }
                isRequired
              />

              <Input
                label="Fungsi / Role"
                placeholder="Contoh: Customer Service"
                value={form.role}
                onValueChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    role: value,
                  }))
                }
                isRequired
              />

              <Select
                label="Tipe"
                selectedKeys={[form.type]}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as ContactType;

                  setForm((current) => ({
                    ...current,
                    type: value,
                  }));
                }}
                isRequired
              >
                <SelectItem key="WHATSAPP">WhatsApp</SelectItem>

                <SelectItem key="TELEGRAM">Telegram</SelectItem>
              </Select>

              <Input
                label={
                  form.type === 'WHATSAPP'
                    ? 'Nomor WhatsApp'
                    : 'Username Telegram'
                }
                placeholder={
                  form.type === 'WHATSAPP'
                    ? 'Contoh: +628123456789'
                    : 'Contoh: @admin_donasi'
                }
                value={form.phone}
                onValueChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    phone: value,
                  }))
                }
                isRequired
              />
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
              {editingContact ? 'Simpan Perubahan' : 'Tambah'}
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
          <ModalHeader>Hapus Contact</ModalHeader>

          <ModalBody>
            <p className="text-sm text-slate-600">
              Yakin ingin menghapus contact{' '}
              <strong>{deletingContact?.name}</strong>?
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
