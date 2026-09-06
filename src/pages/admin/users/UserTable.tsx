import {
  Button,
  Chip,
  Pagination,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react';
import {
  Edit3,
  MoreHorizontal,
  ShieldCheck,
  Trash2,
  UserRound,
} from 'lucide-react';

import type { User } from '@/interfaces/user.interface';

type Props = {
  users: User[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  currentUserEmail?: string;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
};

export default function UserTable({
  users,
  isLoading,
  page,
  totalPages,
  onPageChange,
  currentUserEmail,
  onEdit,
  onDelete,
}: Props) {
  const renderEmptyState = () => {
    return (
      <div className="py-16 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-atac-green-soft text-atac-green-dark flex items-center justify-center mb-4">
          <UserRound size={25} />
        </div>

        <p className="font-semibold text-slate-700">Belum ada user</p>

        <p className="text-sm text-slate-400 mt-1 max-w-sm">
          Tidak ada pengguna yang sesuai dengan pencarian.
        </p>
      </div>
    );
  };

  const skeletonUsers = Array.from({ length: 6 }).map(
    (_, index) =>
      ({
        id: `skeleton-${index}`,
      }) as User
  );

  const tableItems = isLoading ? skeletonUsers : users;

  return (
    <div>
      <Table
        aria-label="Daftar user"
        removeWrapper
        classNames={{
          table: 'min-w-[800px]',
          th: 'bg-slate-50 text-slate-500 text-xs font-semibold',
          td: 'py-4',
        }}
        bottomContent={
          !isLoading && users.length > 0 && totalPages > 0 ? (
            <div className="flex justify-center pt-5">
              <Pagination
                showControls
                color="primary"
                page={page}
                total={totalPages}
                onChange={onPageChange}
              />
            </div>
          ) : null
        }
      >
        <TableHeader>
          <TableColumn>USER</TableColumn>
          <TableColumn>ROLE</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>TERDAFTAR</TableColumn>
          <TableColumn width={60}>AKSI</TableColumn>
        </TableHeader>

        <TableBody
          items={tableItems}
          emptyContent={
            !isLoading && users.length === 0 ? renderEmptyState() : null
          }
        >
          {(user) => {
            const isSelf = user.email === currentUserEmail;

            const isSuperAdmin = user.role === 'SUPERADMIN';

            const cannotDelete = isSelf || isSuperAdmin;

            return (
              <TableRow key={user.id}>
                <TableCell>
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-9 h-9 rounded-full" />
                      <Skeleton className="h-4 w-44 rounded-lg" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-atac-green-soft text-atac-green-dark flex items-center justify-center shrink-0">
                        {user.role === 'SUPERADMIN' ? (
                          <ShieldCheck size={17} />
                        ) : (
                          <UserRound size={17} />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="font-medium text-slate-800 truncate max-w-[260px]">
                          {user.email}
                        </p>

                        {isSelf && (
                          <p className="text-xs text-atac-green-dark mt-0.5">
                            Akun kamu
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </TableCell>

                <TableCell>
                  {isLoading ? (
                    <Skeleton className="h-5 w-20 rounded-full" />
                  ) : (
                    <Chip
                      size="sm"
                      variant="flat"
                      color={
                        user.role === 'SUPERADMIN'
                          ? 'warning'
                          : user.role === 'ADMIN'
                            ? 'primary'
                            : 'default'
                      }
                    >
                      {user.role}
                    </Chip>
                  )}
                </TableCell>

                <TableCell>
                  {isLoading ? (
                    <Skeleton className="h-5 w-20 rounded-full" />
                  ) : (
                    <Chip
                      size="sm"
                      variant="flat"
                      color={user.isActive ? 'success' : 'default'}
                    >
                      {user.isActive ? 'Aktif' : 'Nonaktif'}
                    </Chip>
                  )}
                </TableCell>

                <TableCell>
                  {isLoading ? (
                    <Skeleton className="h-4 w-28 rounded-lg" />
                  ) : (
                    <span className="text-sm text-slate-500">
                      {new Intl.DateTimeFormat('id-ID', {
                        dateStyle: 'medium',
                      }).format(new Date(user.createdAt))}
                    </span>
                  )}
                </TableCell>

                <TableCell>
                  {isLoading ? (
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  ) : (
                    <Dropdown placement="bottom-end">
                      <DropdownTrigger>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          aria-label={`Aksi ${user.email}`}
                        >
                          <MoreHorizontal size={18} />
                        </Button>
                      </DropdownTrigger>

                      <DropdownMenu aria-label="Aksi user">
                        <DropdownItem
                          key="edit"
                          startContent={<Edit3 size={16} />}
                          isDisabled={cannotDelete}
                          description={
                            isSelf
                              ? 'Tidak dapat mengedit akun sendiri'
                              : isSuperAdmin
                                ? 'Superadmin tidak dapat diedit'
                                : undefined
                          }
                          onPress={() => onEdit(user)}
                        >
                          Edit User
                        </DropdownItem>

                        <DropdownItem
                          key="delete"
                          color="danger"
                          startContent={<Trash2 size={16} />}
                          isDisabled={cannotDelete}
                          description={
                            isSelf
                              ? 'Tidak dapat menghapus akun sendiri'
                              : isSuperAdmin
                                ? 'Superadmin tidak dapat dihapus'
                                : undefined
                          }
                          onPress={() => onDelete(user)}
                        >
                          Hapus User
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  )}
                </TableCell>
              </TableRow>
            );
          }}
        </TableBody>
      </Table>
    </div>
  );
}
