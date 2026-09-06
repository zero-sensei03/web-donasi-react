import { Button } from '@heroui/react';
import { Bell, CheckCheck, Loader2, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import {
  getNotifications,
  readAllNotifications,
  readNotification,
} from '@/services/notification/http';

import NotificationTable from './NotificationTable';
import NotificationDetailModal from './NotificationDetailModal';

import type { Notification } from '@/interfaces/notification.interface';

const LIMIT = 10;

export default function NotificationPage() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);

  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /*
   * ==========================================
   * GET NOTIFICATIONS
   * ==========================================
   */

  const notificationQuery = useQuery({
    queryKey: [
      'admin',
      'notifications',
      {
        page,
        limit: LIMIT,
      },
    ],

    queryFn: () =>
      getNotifications({
        page,
        limit: LIMIT,
      }),

    placeholderData: (previousData) => previousData,
  });

  const notifications = notificationQuery.data?.result.data ?? [];

  const meta = notificationQuery.data?.result.meta;

  const totalNotRead = notificationQuery.data?.totalNotRead ?? 0;

  /*
   * ==========================================
   * READ ONE
   * ==========================================
   */

  const readMutation = useMutation({
    mutationFn: readNotification,

    onMutate: () => {
      setErrorMessage(null);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'notifications'],
      });
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            'Gagal menandai notifikasi sebagai dibaca.'
        );
      } else {
        setErrorMessage('Gagal menandai notifikasi sebagai dibaca.');
      }
    },
  });

  /*
   * ==========================================
   * READ ALL
   * ==========================================
   */

  const readAllMutation = useMutation({
    mutationFn: readAllNotifications,

    onMutate: () => {
      setErrorMessage(null);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'notifications'],
      });
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ?? 'Gagal menandai semua notifikasi.'
        );
      } else {
        setErrorMessage('Gagal menandai semua notifikasi.');
      }
    },
  });

  /*
   * ==========================================
   * READ HANDLER
   * ==========================================
   */

  const handleRead = (notification: Notification) => {
    if (notification.isRead) {
      handleDetail(notification);
      return;
    }

    readMutation.mutate(notification.id);
  };

  /*
   * ==========================================
   * DETAIL
   * ==========================================
   */

  const handleDetail = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);

    setTimeout(() => {
      setSelectedNotification(null);
    }, 200);
  };

  /*
   * ==========================================
   * PAGE CHANGE
   * ==========================================
   */

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <Bell className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Notifikasi
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Kelola dan pantau notifikasi sistem.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="flat"
            startContent={
              notificationQuery.isFetching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )
            }
            isDisabled={notificationQuery.isFetching}
            onPress={() => notificationQuery.refetch()}
            className="font-semibold"
          >
            Refresh
          </Button>

          <Button
            size="sm"
            color="primary"
            variant="flat"
            startContent={
              readAllMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCheck className="h-4 w-4" />
              )
            }
            isLoading={readAllMutation.isPending}
            isDisabled={totalNotRead === 0}
            onPress={() => readAllMutation.mutate()}
            className="font-semibold"
          >
            Tandai Semua Dibaca
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Total Notifikasi
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {notificationQuery.isLoading
                  ? '...'
                  : (notificationQuery.data?.result.meta.total ?? 0)}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <Bell className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                Belum Dibaca
              </p>

              <p className="mt-2 text-2xl font-bold text-green-700">
                {notificationQuery.isLoading ? '...' : totalNotRead}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <Bell className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700">
            Terjadi kesalahan
          </p>

          <p className="mt-1 text-xs text-red-600">{errorMessage}</p>
        </div>
      )}

      {/* Result */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Daftar Notifikasi
            </p>

            <p className="text-xs text-slate-500">
              Menampilkan notifikasi terbaru terlebih dahulu.
            </p>
          </div>
        </div>

        <NotificationTable
          data={notifications}
          isLoading={notificationQuery.isLoading}
          page={meta?.page ?? page}
          totalPages={meta?.totalPages ?? 1}
          onPageChange={handlePageChange}
          onRead={handleRead}
        />
      </div>

      {/* Query Error */}
      {notificationQuery.isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700">
            Gagal memuat notifikasi
          </p>

          <p className="mt-1 text-xs text-red-600">Silakan coba lagi.</p>

          <Button
            size="sm"
            variant="flat"
            onPress={() => notificationQuery.refetch()}
            className="mt-3 font-semibold text-red-700"
          >
            Coba Lagi
          </Button>
        </div>
      )}

      {/* Detail */}
      <NotificationDetailModal
        isOpen={isDetailOpen}
        notification={selectedNotification}
        onClose={handleCloseDetail}
        onRead={handleRead}
      />
    </div>
  );
}
