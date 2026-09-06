import {
  Button,
  Chip,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { Bell, CalendarDays, Check, ExternalLink } from 'lucide-react';

import type { Notification } from '@/interfaces/notification.interface';
import { formatDateTime } from '@/utils/date';

interface NotificationDetailModalProps {
  isOpen: boolean;
  notification: Notification | null;
  onClose: () => void;
  onRead: (notification: Notification) => void;
}

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

export default function NotificationDetailModal({
  isOpen,
  notification,
  onClose,
  onRead,
}: NotificationDetailModalProps) {
  if (!notification) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      placement="center"
      scrollBehavior="inside"
      classNames={{
        base: 'bg-white',
        header: 'border-b border-slate-200',
        footer: 'border-t border-slate-200',
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
            <Bell className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-900">
              Detail Notifikasi
            </h2>

            <p className="text-sm font-normal text-slate-500">
              Informasi notifikasi sistem
            </p>
          </div>
        </ModalHeader>

        <ModalBody className="py-5">
          <div className="space-y-5">
            {/* Title */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Chip
                  size="sm"
                  variant="flat"
                  color={getTypeColor(notification.type)}
                  className="font-semibold"
                >
                  {getTypeLabel(notification.type)}
                </Chip>

                {!notification.isRead && (
                  <Chip
                    size="sm"
                    variant="flat"
                    color="success"
                    startContent={
                      <span className="h-2 w-2 rounded-full bg-current" />
                    }
                  >
                    Baru
                  </Chip>
                )}
              </div>

              <h3 className="mt-4 text-xl font-bold leading-7 text-slate-900">
                {notification.title}
              </h3>
            </div>

            <Divider />

            {/* Message */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Pesan
              </p>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="whitespace-pre-line text-sm leading-6 text-slate-700">
                  {notification.message}
                </p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
              <CalendarDays className="mt-0.5 h-4 w-4 text-slate-400" />

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Waktu
                </p>

                <p className="mt-1 text-sm font-medium text-slate-700">
                  {formatDateTime(notification.createdAt)}
                </p>
              </div>
            </div>

            {/* Donation ID */}
            {notification.donationId && (
              <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
                <ExternalLink className="mt-0.5 h-4 w-4 text-slate-400" />

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Donation ID
                  </p>

                  <p className="mt-1 break-all font-mono text-xs text-slate-700">
                    {notification.donationId}
                  </p>
                </div>
              </div>
            )}

            {/* ID */}
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Notification ID
              </p>

              <p className="break-all font-mono text-xs text-slate-400">
                {notification.id}
              </p>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          {!notification.isRead && (
            <Button
              color="primary"
              startContent={<Check className="h-4 w-4" />}
              onPress={() => {
                onRead(notification);
                onClose();
              }}
              className="font-semibold"
            >
              Tandai Dibaca
            </Button>
          )}

          <Button variant="flat" onPress={onClose} className="font-semibold">
            Tutup
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
