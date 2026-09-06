import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  addToast,
} from '@heroui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, UsersRound, X } from 'lucide-react';
import axios from 'axios';

import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from '@/services/user/http';

import type {
  CreateUserPayload,
  UpdateUserPayload,
  User,
} from '@/interfaces/user.interface';

import { isValidationErrorArray } from '@/utils/errorValidation';

import { useAuthStore } from '@/stores/auth';

import UserTable from './UserTable';
import UserFormModal from './UserFormModal';
import DeleteUserModal from './DeleteUserModal';

type StatusFilter = 'all' | 'active' | 'inactive';

const LIMIT = 10;

export default function Users() {
  const queryClient = useQueryClient();

  const currentUser = useAuthStore((state) => state.user);

  const [page, setPage] = useState(1);

  const [searchInput, setSearchInput] = useState('');

  const [search, setSearch] = useState('');

  const [status, setStatus] = useState<StatusFilter>('all');

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [deleteUserData, setDeleteUserData] = useState<User | null>(null);

  /**
   * ==========================================================
   * SEARCH DEBOUNCE
   * ==========================================================
   */
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [searchInput]);

  /**
   * ==========================================================
   * GET USERS
   * ==========================================================
   */
  const usersQuery = useQuery({
    queryKey: [
      'admin',
      'users',
      {
        page,
        limit: LIMIT,
        search,
        status,
      },
    ],

    queryFn: () =>
      getUsers({
        page,
        limit: LIMIT,
        ...(search
          ? {
              search,
            }
          : {}),
        ...(status !== 'all'
          ? {
              status,
            }
          : {}),
      }),

    placeholderData: (previousData) => previousData,

    staleTime: 30_000,
  });

  /**
   * ==========================================================
   * CREATE USER
   * ==========================================================
   */
  const createMutation = useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),

    onSuccess: () => {
      addToast({
        title: 'User berhasil dibuat',
        description: 'Pengguna baru berhasil ditambahkan.',
        color: 'success',
      });

      setIsFormOpen(false);
      setSelectedUser(null);

      queryClient.invalidateQueries({
        queryKey: ['admin', 'users'],
      });
    },

    onError: (error) => {
      handleMutationError(error, 'Gagal membuat user');
    },
  });

  /**
   * ==========================================================
   * UPDATE USER
   * ==========================================================
   */
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      updateUser({
        id,
        payload,
      }),

    onSuccess: () => {
      addToast({
        title: 'User berhasil diperbarui',
        description: 'Perubahan pengguna berhasil disimpan.',
        color: 'success',
      });

      setIsFormOpen(false);
      setSelectedUser(null);

      queryClient.invalidateQueries({
        queryKey: ['admin', 'users'],
      });
    },

    onError: (error) => {
      handleMutationError(error, 'Gagal memperbarui user');
    },
  });

  /**
   * ==========================================================
   * DELETE USER
   * ==========================================================
   */
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),

    onSuccess: () => {
      addToast({
        title: 'User berhasil dihapus',
        description: 'Data pengguna telah dihapus.',
        color: 'success',
      });

      setDeleteUserData(null);

      /**
       * Kalau page terakhir menjadi kosong
       * setelah delete, pindah ke page sebelumnya.
       */
      const currentData = usersQuery.data;

      if (currentData && currentData.data.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      }

      queryClient.invalidateQueries({
        queryKey: ['admin', 'users'],
      });
    },

    onError: (error) => {
      handleMutationError(error, 'Gagal menghapus user');
    },
  });

  /**
   * ==========================================================
   * ERROR HANDLER
   * ==========================================================
   */
  function handleMutationError(error: unknown, fallbackTitle: string) {
    if (axios.isAxiosError(error)) {
      const response = error.response?.data;

      if (isValidationErrorArray(response?.error)) {
        const firstError = response.error[0];

        addToast({
          title: 'Validasi gagal',
          description:
            firstError?.message ??
            response?.message ??
            'Periksa kembali data yang dimasukkan.',
          color: 'danger',
        });

        return;
      }

      addToast({
        title: fallbackTitle,
        description: response?.message ?? 'Terjadi kesalahan pada server.',
        color: 'danger',
      });

      return;
    }

    addToast({
      title: fallbackTitle,
      description:
        error instanceof Error ? error.message : 'Terjadi kesalahan.',
      color: 'danger',
    });
  }

  /**
   * ==========================================================
   * SUBMIT FORM
   * ==========================================================
   */
  const handleSubmit = (data: CreateUserPayload | UpdateUserPayload) => {
    if (selectedUser) {
      updateMutation.mutate({
        id: selectedUser.id,
        payload: data as UpdateUserPayload,
      });

      return;
    }

    createMutation.mutate(data as CreateUserPayload);
  };

  /**
   * ==========================================================
   * OPEN CREATE
   * ==========================================================
   */
  const handleCreate = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  /**
   * ==========================================================
   * OPEN EDIT
   * ==========================================================
   */
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  /**
   * ==========================================================
   * OPEN DELETE
   * ==========================================================
   */
  const handleDelete = (user: User) => {
    /**
     * Defense di frontend.
     *
     * Walaupun tombol sudah disabled,
     * tetap kita validasi lagi di handler.
     */
    if (user.email === currentUser?.email) {
      addToast({
        title: 'Akses ditolak',
        description: 'Kamu tidak dapat menghapus akun sendiri.',
        color: 'danger',
      });

      return;
    }

    if (user.role === 'SUPERADMIN') {
      addToast({
        title: 'Akses ditolak',
        description: 'Akun SUPERADMIN tidak dapat dihapus.',
        color: 'danger',
      });

      return;
    }

    setDeleteUserData(user);
  };

  const isFormLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* ======================================================
          HEADER
      ======================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-atac-green-dark">
            Administration
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
            User
          </h1>

          <p className="text-sm sm:text-base text-slate-500 mt-2">
            Kelola pengguna dan akses administrator.
          </p>
        </div>

        <Button
          color="primary"
          startContent={<Plus size={18} />}
          onPress={handleCreate}
        >
          Tambah User
        </Button>
      </div>

      {/* ======================================================
          CONTENT
      ======================================================= */}
      <Card shadow="none" className="border border-slate-200 bg-white">
        <CardBody className="p-0">
          {/* ==================================================
              FILTER
          =================================================== */}
          <div className="p-4 sm:p-5 border-b border-slate-200">
            <div className="flex flex-col lg:flex-row gap-3">
              {/* Search */}
              <Input
                value={searchInput}
                onValueChange={setSearchInput}
                placeholder="Cari berdasarkan email..."
                startContent={<Search size={18} className="text-slate-400" />}
                endContent={
                  searchInput ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchInput('');
                        setSearch('');
                        setPage(1);
                      }}
                      className="text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  ) : undefined
                }
                variant="bordered"
                radius="lg"
                className="lg:max-w-md"
              />

              {/* Status */}
              <Select
                aria-label="Filter status"
                placeholder="Filter status"
                selectedKeys={new Set([status])}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0];

                  if (
                    value === 'all' ||
                    value === 'active' ||
                    value === 'inactive'
                  ) {
                    setStatus(value);
                    setPage(1);
                  }
                }}
                variant="bordered"
                radius="lg"
                className="lg:w-48"
              >
                <SelectItem key="all">Semua Status</SelectItem>

                <SelectItem key="active">Aktif</SelectItem>

                <SelectItem key="inactive">Nonaktif</SelectItem>
              </Select>
            </div>

            {/* Result info */}
            {usersQuery.data && (
              <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
                <UsersRound size={14} />

                <span>{usersQuery.data.meta.total} user ditemukan</span>
              </div>
            )}
          </div>

          {/* ==================================================
              TABLE
          =================================================== */}
          <div className="overflow-x-auto p-4 sm:p-5">
            <UserTable
              users={usersQuery.data?.data ?? []}
              isLoading={usersQuery.isLoading}
              page={page}
              totalPages={usersQuery.data?.meta.totalPages ?? 0}
              onPageChange={setPage}
              currentUserEmail={currentUser?.email}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>

          {/* Background fetching */}
          {usersQuery.isFetching && !usersQuery.isLoading && (
            <div className="px-5 pb-4">
              <p className="text-xs text-slate-400">Memperbarui data...</p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* ======================================================
          CREATE / UPDATE
      ======================================================= */}
      <UserFormModal
        isOpen={isFormOpen}
        onClose={() => {
          if (isFormLoading) {
            return;
          }

          setIsFormOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleSubmit}
        isLoading={isFormLoading}
        user={selectedUser}
      />

      {/* ======================================================
          DELETE
      ======================================================= */}
      <DeleteUserModal
        isOpen={Boolean(deleteUserData)}
        user={deleteUserData}
        isLoading={deleteMutation.isPending}
        onClose={() => {
          if (deleteMutation.isPending) {
            return;
          }

          setDeleteUserData(null);
        }}
        onConfirm={() => {
          if (!deleteUserData) {
            return;
          }

          deleteMutation.mutate(deleteUserData.id);
        }}
      />
    </div>
  );
}
