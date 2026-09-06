import {
  Chip,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
  ScrollShadow,
} from '@heroui/react';
import { X } from 'lucide-react';

import type { AuditLog } from '@/interfaces/audit.interface';
import { formatDateTime } from '@/utils/date';

interface AuditDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  audit: AuditLog | null;
}

const transactionColor = (
  transaction: AuditLog['transaction']
): 'success' | 'warning' | 'danger' | 'primary' | 'secondary' | 'default' => {
  switch (transaction) {
    case 'CREATE':
    case 'VERIFY':
      return 'success';

    case 'UPDATE':
      return 'warning';

    case 'DELETE':
    case 'REJECT':
      return 'danger';

    case 'LOGIN':
      return 'primary';

    case 'LOGOUT':
      return 'secondary';

    default:
      return 'default';
  }
};

const formatJson = (value: unknown) => {
  if (value === null || value === undefined) {
    return '-';
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return '-';
  }
};

export default function AuditDetailModal({
  isOpen,
  onClose,
  audit,
}: AuditDetailModalProps) {
  if (!audit) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      scrollBehavior="inside"
      placement="center"
      classNames={{
        base: 'bg-white',
        header: 'border-b border-slate-200',
        footer: 'border-t border-slate-200',
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
            <X className="h-5 w-5 rotate-45" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Detail Audit Log
            </h2>

            <p className="text-sm font-normal text-slate-500">
              Informasi aktivitas sistem
            </p>
          </div>
        </ModalHeader>

        <ModalBody className="py-5">
          <ScrollShadow hideScrollBar className="max-h-[65vh] space-y-5">
            {/* Transaction */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Transaction
              </p>

              <Chip
                size="sm"
                variant="flat"
                color={transactionColor(audit.transaction)}
                className="font-semibold"
              >
                {audit.transaction}
              </Chip>
            </div>

            <Divider />

            {/* Basic Information */}
            <div>
              <h3 className="mb-4 text-sm font-bold text-slate-900">
                Informasi Aktivitas
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DetailItem label="Entity" value={audit.entity || '-'} />

                <DetailItem
                  label="Entity ID"
                  value={audit.entityId || '-'}
                  mono
                />

                <DetailItem
                  label="Tanggal"
                  value={formatDateTime(audit.createdAt)}
                />

                <DetailItem label="User ID" value={audit.userId || '-'} mono />
              </div>
            </div>

            <Divider />

            {/* User */}
            <div>
              <h3 className="mb-4 text-sm font-bold text-slate-900">User</h3>

              {audit.user ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    {audit.user.email}
                  </p>

                  <p className="mt-1 break-all font-mono text-xs text-slate-500">
                    {audit.user.id}
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  Tidak ada user yang terkait.
                </div>
              )}
            </div>

            <Divider />

            {/* Description */}
            <div>
              <h3 className="mb-3 text-sm font-bold text-slate-900">
                Description
              </h3>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                {audit.description || '-'}
              </div>
            </div>

            <Divider />

            {/* Request Information */}
            <div>
              <h3 className="mb-4 text-sm font-bold text-slate-900">
                Request Information
              </h3>

              <div className="space-y-4">
                <DetailItem
                  label="IP Address"
                  value={audit.ipAddress || '-'}
                  mono
                />

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    User Agent
                  </p>

                  <div className="break-all rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-5 text-slate-600">
                    {audit.userAgent || '-'}
                  </div>
                </div>
              </div>
            </div>

            <Divider />

            {/* Metadata */}
            <div>
              <h3 className="mb-3 text-sm font-bold text-slate-900">
                Metadata
              </h3>

              {audit.metadata ? (
                <pre className="max-h-80 overflow-auto rounded-xl border border-slate-200 bg-slate-950 p-4 font-mono text-xs leading-5 text-slate-200">
                  {formatJson(audit.metadata)}
                </pre>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  Tidak ada metadata.
                </div>
              )}
            </div>
          </ScrollShadow>
        </ModalBody>

        <ModalFooter>
          <Button variant="flat" onPress={onClose} className="font-semibold">
            Tutup
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

interface DetailItemProps {
  label: string;
  value: string;
  mono?: boolean;
}

function DetailItem({ label, value, mono = false }: DetailItemProps) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p
        className={`break-all text-sm text-slate-800 ${
          mono ? 'font-mono text-xs' : 'font-medium'
        }`}
      >
        {value}
      </p>
    </div>
  );
}
