import { useEffect, useState } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
} from '@heroui/react';
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';

import type {
  CreateUserPayload,
  UpdateUserPayload,
  User,
} from '@/interfaces/user.interface';

type FormErrors = {
  email?: string;
  password?: string;
  role?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserPayload | UpdateUserPayload) => void;
  isLoading?: boolean;
  user?: User | null;
};

const defaultForm = {
  email: '',
  password: '',
  role: 'EDITOR' as 'ADMIN' | 'EDITOR',
  isActive: true,
};

export default function UserFormModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  user,
}: Props) {
  const isEdit = Boolean(user);

  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (user) {
      setForm({
        email: user.email,
        password: '',
        role: user.role === 'ADMIN' ? 'ADMIN' : 'EDITOR',
        isActive: user.isActive,
      });
    } else {
      setForm(defaultForm);
    }

    setErrors({});
    setTouched({});
    setShowPassword(false);
  }, [isOpen, user]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!isEdit && !form.password) {
      newErrors.password = 'Password wajib diisi';
    }

    if (form.password && form.password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter';
    }

    if (!form.role) {
      newErrors.role = 'Role wajib dipilih';
    }

    setErrors(newErrors);

    setTouched({
      email: true,
      password: true,
      role: true,
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    const payload = {
      email: form.email.trim(),
      role: form.role,
      isActive: form.isActive,
      ...(form.password
        ? {
            password: form.password,
          }
        : {}),
    };

    onSubmit(payload);
  };

  const handleEmailChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      email: value,
    }));

    if (touched.email) {
      if (!value.trim()) {
        setErrors((prev) => ({
          ...prev,
          email: 'Email wajib diisi',
        }));
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          email: 'Format email tidak valid',
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          email: undefined,
        }));
      }
    }
  };

  const handlePasswordChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      password: value,
    }));

    if (touched.password) {
      if (!isEdit && !value) {
        setErrors((prev) => ({
          ...prev,
          password: 'Password wajib diisi',
        }));
      } else if (value && value.length < 8) {
        setErrors((prev) => ({
          ...prev,
          password: 'Password minimal 8 karakter',
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          password: undefined,
        }));
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      scrollBehavior="inside"
      size="lg"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">
            {isEdit ? 'Edit User' : 'Tambah User'}
          </h2>

          <p className="text-sm font-normal text-slate-500">
            {isEdit
              ? 'Perbarui informasi pengguna.'
              : 'Tambahkan pengguna baru ke sistem.'}
          </p>
        </ModalHeader>

        <ModalBody className="gap-5">
          <Input
            label="Email"
            placeholder="contoh@email.com"
            type="email"
            value={form.email}
            onValueChange={handleEmailChange}
            onBlur={() => {
              setTouched((prev) => ({
                ...prev,
                email: true,
              }));

              if (!form.email.trim()) {
                setErrors((prev) => ({
                  ...prev,
                  email: 'Email wajib diisi',
                }));
              }
            }}
            isInvalid={Boolean(touched.email && errors.email)}
            errorMessage={touched.email ? errors.email : undefined}
            startContent={<Mail size={18} className="text-slate-400" />}
            variant="bordered"
            radius="lg"
            isDisabled={isLoading}
          />

          <Input
            label={isEdit ? 'Password Baru' : 'Password'}
            placeholder={
              isEdit
                ? 'Kosongkan jika tidak ingin mengubah'
                : 'Minimal 8 karakter'
            }
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onValueChange={handlePasswordChange}
            onBlur={() => {
              setTouched((prev) => ({
                ...prev,
                password: true,
              }));
            }}
            isInvalid={Boolean(touched.password && errors.password)}
            errorMessage={touched.password ? errors.password : undefined}
            startContent={<LockKeyhole size={18} className="text-slate-400" />}
            endContent={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="cursor-pointer text-slate-400 hover:text-atac-green-dark"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            variant="bordered"
            radius="lg"
            isDisabled={isLoading}
          />

          <Select
            label="Role"
            placeholder="Pilih role"
            selectedKeys={new Set([form.role])}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0];

              if (value === 'ADMIN' || value === 'EDITOR') {
                setForm((prev) => ({
                  ...prev,
                  role: value,
                }));
              }
            }}
            isInvalid={Boolean(touched.role && errors.role)}
            errorMessage={touched.role ? errors.role : undefined}
            variant="bordered"
            radius="lg"
            isDisabled={isLoading}
          >
            <SelectItem key="ADMIN">Admin</SelectItem>

            <SelectItem key="EDITOR">Editor</SelectItem>
          </Select>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <Switch
              isSelected={form.isActive}
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  isActive: value,
                }))
              }
              isDisabled={isLoading}
              color="success"
            >
              <div>
                <p className="text-sm font-medium text-slate-800">User aktif</p>

                <p className="text-xs text-slate-500 mt-0.5">
                  User dapat masuk ke sistem.
                </p>
              </div>
            </Switch>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="flat" onPress={onClose} isDisabled={isLoading}>
            Batal
          </Button>

          <Button color="primary" onPress={handleSubmit} isLoading={isLoading}>
            {isEdit ? 'Simpan Perubahan' : 'Tambah User'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
