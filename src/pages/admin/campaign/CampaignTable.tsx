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
import { Ellipsis, Eye, Pencil, Play, RotateCcw, Trash2 } from 'lucide-react';

import type { Campaign } from '@/interfaces/campaign.interface';
import { formatCurrency, getCampaignStatusLabel } from '@/utils/campaign';
import { formatDateTime } from '@/utils/date';

interface CampaignTableProps {
  data: Campaign[];
  isLoading: boolean;
  onDetail: (campaign: Campaign) => void;
  onEdit: (campaign: Campaign) => void;
  onActivate: (campaign: Campaign) => void;
  onDelete: (campaign: Campaign) => void;
  onRestore: (campaign: Campaign) => void;
}

const columns = [
  'Campaign',
  'Periode',
  'Target Donasi',
  'Sponsor',
  'Status',
  'Dibuat',
  'Aksi',
];

export default function CampaignTable({
  data,
  isLoading,
  onDetail,
  onEdit,
  onActivate,
  onDelete,
  onRestore,
}: CampaignTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <Table
        aria-label="Campaign table"
        classNames={{
          wrapper: 'min-w-[1050px] shadow-none p-0',
        }}
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column}>{column}</TableColumn>
          ))}
        </TableHeader>

        <TableBody
          emptyContent={!isLoading ? 'Belum ada campaign.' : undefined}
        >
          {isLoading
            ? Array.from({ length: 7 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell>
                    <Skeleton className="h-10 w-56 rounded-lg" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-10 w-44 rounded-lg" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-5 w-28 rounded-lg" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-5 w-16 rounded-lg" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-5 w-36 rounded-lg" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-8 w-10 rounded-lg" />
                  </TableCell>
                </TableRow>
              ))
            : data.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <div className="max-w-[280px]">
                      <p className="truncate font-semibold text-slate-900">
                        {campaign.title}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {campaign.id}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-xs text-slate-600">
                      <p>{formatDateTime(campaign.startAt)}</p>

                      <p className="mt-1">{formatDateTime(campaign.endAt)}</p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(campaign.targetDonationAmount)}
                    </span>
                  </TableCell>

                  <TableCell>{campaign.sponsorCount}</TableCell>

                  <TableCell>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={
                        campaign.status === 'ACTIVE' ? 'success' : 'default'
                      }
                    >
                      {getCampaignStatusLabel(campaign.status)}
                    </Chip>
                  </TableCell>

                  <TableCell>
                    <span className="text-xs text-slate-600">
                      {formatDateTime(campaign.createdAt)}
                    </span>
                  </TableCell>

                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly size="sm" variant="light">
                          <Ellipsis className="h-4 w-4" />
                        </Button>
                      </DropdownTrigger>

                      <DropdownMenu aria-label="Campaign actions">
                        <DropdownItem
                          key="detail"
                          startContent={<Eye className="h-4 w-4" />}
                          onPress={() => onDetail(campaign)}
                        >
                          Detail
                        </DropdownItem>

                        <DropdownItem
                          key="edit"
                          startContent={<Pencil className="h-4 w-4" />}
                          onPress={() => onEdit(campaign)}
                        >
                          Edit
                        </DropdownItem>

                        {campaign.status !== 'ACTIVE' ? (
                          <DropdownItem
                            key="activate"
                            startContent={<Play className="h-4 w-4" />}
                            onPress={() => onActivate(campaign)}
                          >
                            Jadikan Aktif
                          </DropdownItem>
                        ) : null}

                        {campaign.deletedAt ? (
                          <DropdownItem
                            key="restore"
                            color="success"
                            startContent={<RotateCcw className="h-4 w-4" />}
                            onPress={() => onRestore(campaign)}
                          >
                            Restore
                          </DropdownItem>
                        ) : (
                          <DropdownItem
                            key="delete"
                            color="danger"
                            startContent={<Trash2 className="h-4 w-4" />}
                            onPress={() => onDelete(campaign)}
                          >
                            Hapus
                          </DropdownItem>
                        )}
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
