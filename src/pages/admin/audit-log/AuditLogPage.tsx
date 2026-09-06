import { Button, Input, Select, SelectItem } from '@heroui/react';
import { RotateCcw, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getAuditLogs } from '@/services/audit-log/http';
import AuditTable from './AuditTable';
import AuditDetailModal from './AuditDetailModal';
import type { AuditLog, AuditTransaction } from '@/interfaces/audit.interface';
import { toUTCDateTime } from '@/utils/date';

const LIMIT = 10;

const TRANSACTION_OPTIONS: Array<{
  key: AuditTransaction;
  label: string;
}> = [
  {
    key: 'CREATE',
    label: 'Create',
  },
  {
    key: 'UPDATE',
    label: 'Update',
  },
  {
    key: 'DELETE',
    label: 'Delete',
  },
  {
    key: 'VERIFY',
    label: 'Verify',
  },
  {
    key: 'REJECT',
    label: 'Reject',
  },
  {
    key: 'LOGIN',
    label: 'Login',
  },
  {
    key: 'LOGOUT',
    label: 'Logout',
  },
];

export default function AuditLogPage() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [transaction, setTransaction] = useState<AuditTransaction | ''>('');

  const [entity, setEntity] = useState('');

  /**
   * Nilai dari input datetime-local adalah waktu lokal browser.
   *
   * Contoh:
   * 2026-09-06T08:00
   *
   * Akan dikonversi menjadi:
   * 2026-09-06 01:00:00
   *
   * sebelum dikirim ke backend.
   */
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [selectedAudit, setSelectedAudit] = useState<AuditLog | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);

  /**
   * Debounce search
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => {
      clearTimeout(timeout);
    };
  }, [search]);

  /**
   * Query audit log
   */
  const auditQuery = useQuery({
    queryKey: [
      'admin',
      'audit',
      {
        page,
        limit: LIMIT,
        search: debouncedSearch,
        transaction,
        entity,
        startDate,
        endDate,
      },
    ],

    queryFn: () =>
      getAuditLogs({
        page,
        limit: LIMIT,

        ...(debouncedSearch
          ? {
              search: debouncedSearch,
            }
          : {}),

        ...(transaction
          ? {
              transaction,
            }
          : {}),

        ...(entity
          ? {
              entity,
            }
          : {}),

        ...(startDate
          ? {
              startDate: toUTCDateTime(startDate),
            }
          : {}),

        ...(endDate
          ? {
              endDate: toUTCDateTime(endDate),
            }
          : {}),
      }),

    placeholderData: (previousData) => previousData,
  });

  const data = auditQuery.data?.data ?? [];
  const meta = auditQuery.data?.meta;

  const handleDetail = (audit: AuditLog) => {
    setSelectedAudit(audit);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);

    setTimeout(() => {
      setSelectedAudit(null);
    }, 200);
  };

  const handleReset = () => {
    setSearch('');
    setDebouncedSearch('');
    setTransaction('');
    setEntity('');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  const hasFilter = search || transaction || entity || startDate || endDate;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Audit Log
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Pantau seluruh aktivitas yang dilakukan pengguna di dalam sistem.
          </p>
        </div>
      </div>

      {/* Filter Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          {/* Search */}
          <div className="xl:col-span-4">
            <Input
              label="Pencarian"
              labelPlacement="outside"
              placeholder="Cari description atau entity ID..."
              value={search}
              onValueChange={setSearch}
              startContent={<Search className="h-4 w-4 text-slate-400" />}
              isClearable
              onClear={() => setSearch('')}
            />
          </div>

          {/* Transaction */}
          <div className="xl:col-span-2">
            <Select
              label="Transaction"
              labelPlacement="outside"
              placeholder="Semua"
              selectedKeys={transaction ? [transaction] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0];

                setTransaction(
                  typeof value === 'string' ? (value as AuditTransaction) : ''
                );

                setPage(1);
              }}
            >
              {TRANSACTION_OPTIONS.map((item) => (
                <SelectItem key={item.key}>{item.label}</SelectItem>
              ))}
            </Select>
          </div>

          {/* Entity */}
          <div className="xl:col-span-2">
            <Input
              label="Entity"
              labelPlacement="outside"
              placeholder="Contoh: USER"
              value={entity}
              onValueChange={(value) => {
                setEntity(value);
                setPage(1);
              }}
              isClearable
              onClear={() => setEntity('')}
            />
          </div>

          {/* Start Date */}
          <div className="xl:col-span-2">
            <Input
              type="datetime-local"
              label="Tanggal Mulai"
              labelPlacement="outside"
              placeholder="Tanggal Mulai"
              value={startDate}
              onValueChange={(value) => {
                setStartDate(value);
                setPage(1);
              }}
            />
          </div>

          {/* End Date */}
          <div className="xl:col-span-2">
            <Input
              type="datetime-local"
              label="Tanggal Akhir"
              labelPlacement="outside"
              placeholder="Tanggal Akhir"
              value={endDate}
              onValueChange={(value) => {
                setEndDate(value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {/* Filter Footer */}
        {hasFilter && (
          <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">Filter sedang aktif.</p>

            <Button
              size="sm"
              variant="light"
              startContent={<RotateCcw className="h-4 w-4" />}
              onPress={handleReset}
              className="w-fit font-semibold text-slate-600"
            >
              Reset Filter
            </Button>
          </div>
        )}
      </div>

      {/* Result Information */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">
            Daftar Aktivitas
          </p>

          <p className="text-xs text-slate-500">
            {auditQuery.isLoading
              ? 'Memuat data...'
              : `${meta?.total ?? 0} aktivitas ditemukan`}
          </p>
        </div>

        {auditQuery.isFetching && !auditQuery.isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            Memperbarui data...
          </div>
        )}
      </div>

      {/* Table */}
      <AuditTable
        data={data}
        isLoading={auditQuery.isLoading}
        page={meta?.page ?? page}
        totalPages={meta?.totalPages ?? 1}
        onPageChange={setPage}
        onDetail={handleDetail}
      />

      {/* Error */}
      {auditQuery.isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <X className="h-5 w-5 text-red-500" />
            </div>

            <div>
              <p className="text-sm font-semibold text-red-700">
                Gagal memuat audit log
              </p>

              <p className="mt-1 text-xs text-red-600">
                Terjadi kesalahan ketika mengambil data. Silakan coba lagi.
              </p>

              <Button
                size="sm"
                variant="flat"
                className="mt-3 font-semibold text-red-700"
                onPress={() => auditQuery.refetch()}
              >
                Coba Lagi
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Detail */}
      <AuditDetailModal
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        audit={selectedAudit}
      />
    </div>
  );
}
