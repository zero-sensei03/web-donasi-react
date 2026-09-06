import {
  Button,
  Chip,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { Bell, Check, Circle, Eye } from 'lucide-react';

import type { Notification } from '@/interfaces/notification.interface';
import { formatDateTime } from '@/utils/date';

interface NotificationTableProps {
  data: Notification[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRead: (notification: Notification) => void;
}

const SKELETON_ROWS = Array.from({ length: 8 }, (_, index) => ({
  id: `skeleton-${index}`,
}));

const getTypeLabel = (type: Notification['type']) => {
  switch (type) {
    case 'NEW_DONATION':
      return 'Donasi Baru';

    case 'SYSTEM':
      return 'System';

    default:
      return type;
  }
};

const getTypeColor = (
  type: Notification['type']
): 'success' | 'primary' | 'secondary' | 'default' => {
  switch (type) {
    case 'NEW_DONATION':
      return 'success';

    case 'SYSTEM':
      return 'primary';

    default:
      return 'default';
  }
};

export default function NotificationTable({
  data,
  isLoading,
  page,
  totalPages,
  onPageChange,
  onRead,
}: NotificationTableProps) {
  const rows = isLoading ? SKELETON_ROWS : data;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <Table
          aria-label="Notification table"
          removeWrapper
          classNames={{
            table: 'min-w-[900px]',
            th: 'bg-slate-50 text-xs font-semibold text-slate-500',
            td: 'py-4',
          }}
        >
          <TableHeader>
            <TableColumn>NOTIFIKASI</TableColumn>
            <TableColumn>TYPE</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>TANGGAL</TableColumn>
            <TableColumn align="center">AKSI</TableColumn>
          </TableHeader>

          <TableBody
            items={rows}
            emptyContent={
              <div className="flex flex-col items-center justify-center py-12">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <Bell className="h-5 w-5 text-slate-400" />
                </div>

                <p className="text-sm font-semibold text-slate-700">
                  Belum ada notifikasi
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Notifikasi sistem akan muncul di sini.
                </p>
              </div>
            }
          >
            {(item) => {
              if (isLoading) {
                return (
                  <TableRow key={item.id}>
                    {Array.from({ length: 5 }, (_, index) => (
                      <TableCell key={index}>
                        <Skeleton className="h-4 w-full rounded-lg" />
                      </TableCell>
                    ))}
                  </TableRow>
                );
              }

              const notification = item as Notification;

              return (
                <TableRow
                  key={notification.id}
                  className={
                    notification.isRead
                      ? 'hover:bg-slate-50'
                      : 'bg-green-50/40 hover:bg-green-50/70'
                  }
                >
                  {/* Notification */}
                  <TableCell>
                    <div className="flex max-w-[420px] items-start gap-3">
                      <div
                        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          notification.isRead
                            ? 'bg-slate-100 text-slate-500'
                            : 'bg-green-100 text-green-600'
                        }`}
                      >
                        <Bell className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {!notification.isRead && (
                            <Circle className="h-2 w-2 shrink-0 fill-green-500 text-green-500" />
                          )}

                          <p
                            className={`truncate text-sm ${
                              notification.isRead
                                ? 'font-medium text-slate-700'
                                : 'font-bold text-slate-900'
                            }`}
                          >
                            {notification.title}
                          </p>
                        </div>

                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Type */}
                  <TableCell>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={getTypeColor(notification.type)}
                      className="font-semibold"
                    >
                      {getTypeLabel(notification.type)}
                    </Chip>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    {notification.isRead ? (
                      <Chip
                        size="sm"
                        variant="flat"
                        color="default"
                        startContent={<Check className="h-3.5 w-3.5" />}
                      >
                        Dibaca
                      </Chip>
                    ) : (
                      <Chip
                        size="sm"
                        variant="flat"
                        color="success"
                        startContent={
                          <Circle className="h-2.5 w-2.5 fill-current" />
                        }
                      >
                        Baru
                      </Chip>
                    )}
                  </TableCell>

                  {/* Date */}
                  <TableCell>
                    <span className="whitespace-nowrap text-sm text-slate-600">
                      {formatDateTime(notification.createdAt)}
                    </span>
                  </TableCell>

                  {/* Action */}
                  <TableCell>
                    <div className="flex justify-center">
                      <Button
                        size="sm"
                        variant="light"
                        startContent={
                          notification.isRead ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )
                        }
                        onPress={() => onRead(notification)}
                        className="font-semibold text-slate-600"
                      >
                        {notification.isRead ? 'Lihat' : 'Tandai Dibaca'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            }}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isLoading && data.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            Halaman <span className="font-semibold text-slate-700">{page}</span>{' '}
            dari{' '}
            <span className="font-semibold text-slate-700">{totalPages}</span>
          </p>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="flat"
              isDisabled={page <= 1}
              onPress={() => onPageChange(page - 1)}
              className="font-semibold"
            >
              Sebelumnya
            </Button>

            <Button
              size="sm"
              variant="flat"
              isDisabled={page >= totalPages}
              onPress={() => onPageChange(page + 1)}
              className="font-semibold"
            >
              Berikutnya
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
