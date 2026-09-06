import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { AlertTriangle, Trash2 } from 'lucide-react';

import type { User } from '@/interfaces/user.interface';

type Props = {
  isOpen: boolean;
  user: User | null;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteUserModal({
  isOpen,
  user,
  isLoading = false,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center">
      <ModalContent>
        <ModalHeader>Hapus User</ModalHeader>

        <ModalBody>
          <div className="flex gap-4">
            <div className="w-11 h-11 shrink-0 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle size={21} />
            </div>

            <div>
              <p className="font-medium text-slate-900">
                Apakah kamu yakin ingin menghapus user ini?
              </p>

              {user && (
                <p className="text-sm text-slate-500 mt-2 break-all">
                  {user.email}
                </p>
              )}

              <p className="text-sm text-red-500 mt-3">
                Data yang sudah dihapus tidak dapat dikembalikan.
              </p>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="flat" onPress={onClose} isDisabled={isLoading}>
            Batal
          </Button>

          <Button
            color="danger"
            startContent={!isLoading && <Trash2 size={17} />}
            onPress={onConfirm}
            isLoading={isLoading}
          >
            Hapus User
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
