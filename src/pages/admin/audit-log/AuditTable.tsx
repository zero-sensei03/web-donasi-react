import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { Eye, MoreHorizontal } from 'lucide-react';

import type { AuditLog } from '@/interfaces/audit.interface';
import { formatDateTime } from '@/utils/date';

interface AuditTableProps {
  data: AuditLog[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDetail: (audit: AuditLog) => void;
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

const SKELETON_ROWS = Array.from({ length: 8 }, (_, index) => ({
  id: `skeleton-${index}`,
}));

export default function AuditTable({
  data,
  isLoading,
  page,
  totalPages,
  onPageChange,
  onDetail,
}: AuditTableProps) {
  const rows = isLoading ? SKELETON_ROWS : data;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <Table
          aria-label="Audit log table"
          removeWrapper
          classNames={{
            table: 'min-w-[1000px]',
            th: 'bg-slate-50 text-xs font-semibold text-slate-500',
            td: 'py-3.5',
          }}
        >
          <TableHeader>
            <TableColumn>TANGGAL</TableColumn>
            <TableColumn>USER</TableColumn>
            <TableColumn>TRANSACTION</TableColumn>
            <TableColumn>ENTITY</TableColumn>
            <TableColumn>DESCRIPTION</TableColumn>
            <TableColumn>IP ADDRESS</TableColumn>
            <TableColumn align="center">AKSI</TableColumn>
          </TableHeader>

          <TableBody
            items={rows}
            emptyContent={
              <div className="flex flex-col items-center justify-center py-12">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <Eye className="h-5 w-5 text-slate-400" />
                </div>

                <p className="text-sm font-semibold text-slate-700">
                  Belum ada audit log
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Data aktivitas akan muncul di sini.
                </p>
              </div>
            }
          >
            {(item) => {
              if (isLoading) {
                return (
                  <TableRow key={item.id}>
                    {Array.from({ length: 7 }, (_, index) => (
                      <TableCell key={index}>
                        <Skeleton className="h-4 w-full rounded-lg" />
                      </TableCell>
                    ))}
                  </TableRow>
                );
              }

              const audit = item as AuditLog;

              return (
                <TableRow key={audit.id} className="hover:bg-slate-50">
                  <TableCell>
                    <div className="whitespace-nowrap">
                      <p className="text-sm font-medium text-slate-800">
                        {formatDateTime(audit.createdAt)}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    {audit.user ? (
                      <div className="max-w-[220px]">
                        <p className="truncate text-sm font-medium text-slate-800">
                          {audit.user.email}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">System</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={transactionColor(audit.transaction)}
                      className="font-semibold"
                    >
                      {audit.transaction}
                    </Chip>
                  </TableCell>

                  <TableCell>
                    <div className="max-w-[140px]">
                      <p className="truncate text-sm font-semibold uppercase text-slate-700">
                        {audit.entity || '-'}
                      </p>

                      {audit.entityId && (
                        <p className="mt-0.5 truncate font-mono text-[10px] text-slate-400">
                          {audit.entityId}
                        </p>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <p className="max-w-[260px] truncate text-sm text-slate-600">
                      {audit.description || '-'}
                    </p>
                  </TableCell>

                  <TableCell>
                    <span className="font-mono text-xs text-slate-600">
                      {audit.ipAddress || '-'}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-center">
                      <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            aria-label="Menu audit log"
                          >
                            <MoreHorizontal className="h-5 w-5 text-slate-500" />
                          </Button>
                        </DropdownTrigger>

                        <DropdownMenu
                          aria-label="Audit log actions"
                          onAction={(key) => {
                            if (key === 'detail') {
                              onDetail(audit);
                            }
                          }}
                        >
                          <DropdownItem
                            key="detail"
                            startContent={<Eye className="h-4 w-4" />}
                          >
                            Lihat Detail
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </TableCell>
                </TableRow>
              );
            }}
          </TableBody>
        </Table>
      </div>

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
