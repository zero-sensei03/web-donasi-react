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
import { CheckCircle2, Eye } from 'lucide-react';

import type { Donation } from '@/interfaces/donation.interface';
import { formatCurrency, getDonationStatusLabel } from '@/utils/campaign';
import { formatDateTime } from '@/utils/date';

interface DonationTableProps {
  data: Donation[];
  isLoading: boolean;
  onDetail: (donation: Donation) => void;
  onApprove: (donation: Donation) => void;
}

const getStatusColor = (status: Donation['status']) => {
  switch (status) {
    case 'ACCEPTED':
    case 'ACCEPTED_BY_REVISION':
      return 'success';

    case 'REJECTED':
      return 'danger';

    case 'PENDING':
      return 'warning';

    default:
      return 'default';
  }
};

export default function DonationTable({
  data,
  isLoading,
  onDetail,
  onApprove,
}: DonationTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <Table
        aria-label="Donation table"
        classNames={{
          wrapper: 'min-w-[950px] shadow-none p-0',
        }}
      >
        <TableHeader>
          <TableColumn>DONATUR</TableColumn>
          <TableColumn>NOMINAL</TableColumn>
          <TableColumn>DITERIMA</TableColumn>
          <TableColumn>PESAN</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>TANGGAL</TableColumn>
          <TableColumn>AKSI</TableColumn>
        </TableHeader>

        <TableBody
          emptyContent={
            !isLoading ? 'Belum ada donasi untuk campaign ini.' : undefined
          }
        >
          {isLoading
            ? Array.from({ length: 7 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell>
                    <Skeleton className="h-5 w-32 rounded-lg" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-5 w-28 rounded-lg" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-5 w-28 rounded-lg" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-5 w-44 rounded-lg" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-5 w-36 rounded-lg" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-8 w-24 rounded-lg" />
                  </TableCell>
                </TableRow>
              ))
            : data.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {donation.donorName?.trim() || 'Hamba Allah'}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(donation.amount)}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(donation.acceptedAmount)}
                    </span>
                  </TableCell>

                  <TableCell>
                    <p className="max-w-[220px] truncate text-sm text-slate-600">
                      {donation.message || '-'}
                    </p>
                  </TableCell>

                  <TableCell>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={getStatusColor(donation.status)}
                    >
                      {getDonationStatusLabel(donation.status)}
                    </Chip>
                  </TableCell>

                  <TableCell>
                    <span className="text-xs text-slate-600">
                      {formatDateTime(donation.createdAt)}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        startContent={<Eye className="h-4 w-4" />}
                        onPress={() => onDetail(donation)}
                      >
                        Detail
                      </Button>

                      {donation.status === 'PENDING' && (
                        <Button
                          size="sm"
                          color="success"
                          variant="flat"
                          isIconOnly
                          aria-label="Approve donation"
                          onPress={() => onApprove(donation)}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
