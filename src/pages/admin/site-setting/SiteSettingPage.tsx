import {
  Button,
  Card,
  CardBody,
  Input,
  Skeleton,
  Textarea,
} from '@heroui/react';
import {
  Check,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  Upload,
} from 'lucide-react';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa6';
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import {
  getSiteSettings,
  updateSiteSetting,
  updateSiteSettingLogo,
} from '@/services/siteSetting/http';
import type { SiteSetting } from '@/interfaces/site.interface';

interface SettingForm {
  name: string;
  address: string;
  phone: string;
  email: string;
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  tiktok: string;
}

const DEFAULT_FORM: SettingForm = {
  name: '',
  address: '',
  phone: '',
  email: '',
  facebook: '',
  instagram: '',
  twitter: '',
  youtube: '',
  tiktok: '',
};

const getSettingValue = (
  settings: SiteSetting[] | undefined,
  key: string
): string => {
  return settings?.find((item) => item.key === key)?.value ?? '';
};

export default function SiteSettingPage() {
  const queryClient = useQueryClient();

  const logoInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<SettingForm>(DEFAULT_FORM);

  const [logoUrl, setLogoUrl] = useState('');

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [savingKey, setSavingKey] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /*
   * ============================
   * GET SETTINGS
   * ============================
   */
  const settingsQuery = useQuery({
    queryKey: ['admin', 'site-setting'],
    queryFn: getSiteSettings,
  });

  /*
   * Populate form setelah data selesai diambil
   */
  useEffect(() => {
    if (!settingsQuery.data) {
      return;
    }

    const settings = settingsQuery.data;

    setForm({
      name: getSettingValue(settings, 'app.name'),
      address: getSettingValue(settings, 'app.address'),
      phone: getSettingValue(settings, 'app.phone'),
      email: getSettingValue(settings, 'app.email'),
      facebook: getSettingValue(settings, 'app.facebook'),
      instagram: getSettingValue(settings, 'app.instagram'),
      twitter: getSettingValue(settings, 'app.twitter'),
      youtube: getSettingValue(settings, 'app.youtube'),
      tiktok: getSettingValue(settings, 'app.tiktok'),
    });

    setLogoUrl(getSettingValue(settings, 'app.logo'));
  }, [settingsQuery.data]);

  /*
   * ============================
   * UPDATE NORMAL SETTING
   * ============================
   */
  const updateMutation = useMutation({
    mutationFn: updateSiteSetting,

    onMutate: (payload) => {
      setSavingKey(payload.key);
      setErrorMessage(null);
    },

    onSuccess: (result) => {
      queryClient.setQueryData<SiteSetting[]>(
        ['admin', 'site-setting'],
        (oldData) => {
          if (!oldData) {
            return [result];
          }

          return oldData.map((item) =>
            item.key === result.key ? result : item
          );
        }
      );
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ?? 'Gagal memperbarui site setting.'
        );
      } else {
        setErrorMessage('Gagal memperbarui site setting.');
      }
    },

    onSettled: () => {
      setSavingKey(null);
    },
  });

  /*
   * ============================
   * UPDATE LOGO
   * ============================
   */
  const logoMutation = useMutation({
    mutationFn: updateSiteSettingLogo,

    onMutate: () => {
      setErrorMessage(null);
    },

    onSuccess: (result) => {
      setLogoUrl(result.value);

      setLogoPreview(null);
      setLogoFile(null);

      if (logoInputRef.current) {
        logoInputRef.current.value = '';
      }

      queryClient.setQueryData<SiteSetting[]>(
        ['admin', 'site-setting'],
        (oldData) => {
          if (!oldData) {
            return [result];
          }

          return oldData.map((item) =>
            item.key === result.key ? result : item
          );
        }
      );
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ?? 'Gagal memperbarui logo.'
        );
      } else {
        setErrorMessage('Gagal memperbarui logo.');
      }
    },
  });

  /*
   * ============================
   * FORM CHANGE
   * ============================
   */
  const updateForm = (key: keyof SettingForm, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  /*
   * ============================
   * SAVE NORMAL SETTING
   * ============================
   */
  const handleSave = (key: keyof SettingForm, value: string) => {
    updateMutation.mutate(
      {
        key: `app.${key}`,
        value,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['site-setting'],
          });
        },
      }
    );
  };

  /*
   * ============================
   * LOGO FILE SELECT
   * ============================
   */
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Logo hanya boleh menggunakan JPG, PNG, atau WEBP.');

      event.target.value = '';
      return;
    }

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      setErrorMessage('Ukuran logo maksimal 2 MB.');

      event.target.value = '';
      return;
    }

    setErrorMessage(null);

    setLogoFile(file);

    const previewUrl = URL.createObjectURL(file);

    setLogoPreview(previewUrl);
  };

  /*
   * ============================
   * SAVE LOGO
   * ============================
   */
  const handleSaveLogo = () => {
    if (!logoFile) {
      setErrorMessage('Pilih logo terlebih dahulu.');
      return;
    }

    logoMutation.mutate(logoFile, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['site-setting'],
        });
      },
    });
  };

  /*
   * ============================
   * RESET LOGO
   * ============================
   */
  const handleResetLogo = () => {
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }

    setLogoPreview(null);
    setLogoFile(null);

    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }

    setErrorMessage(null);
  };

  /*
   * ============================
   * LOADING
   * ============================
   */
  if (settingsQuery.isLoading) {
    return <SiteSettingSkeleton />;
  }

  /*
   * ============================
   * ERROR
   * ============================
   */
  if (settingsQuery.isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <p className="text-sm font-semibold text-red-700">
          Gagal memuat site setting.
        </p>

        <p className="mt-1 text-xs text-red-600">
          Terjadi kesalahan ketika mengambil konfigurasi website.
        </p>

        <Button
          size="sm"
          variant="flat"
          onPress={() => settingsQuery.refetch()}
          className="mt-4 font-semibold text-red-700"
        >
          Coba Lagi
        </Button>
      </div>
    );
  }

  const hasData = settingsQuery.data?.length;

  if (!hasData) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
          <Globe className="h-6 w-6 text-slate-400" />
        </div>

        <h2 className="mt-4 text-base font-bold text-slate-800">
          Site Setting belum tersedia
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Belum ada konfigurasi website yang tersedia.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Site Setting
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Kelola informasi dan konfigurasi utama website.
        </p>
      </div>

      {/* Global Error */}
      {errorMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />

          <div className="flex-1">
            <p className="text-sm font-semibold text-red-700">
              Terjadi kesalahan
            </p>

            <p className="mt-1 text-xs text-red-600">{errorMessage}</p>
          </div>

          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={() => setErrorMessage(null)}
          >
            ×
          </Button>
        </div>
      )}

      {/* General Information */}
      <Card shadow="none" className="border border-slate-200 bg-white">
        <CardBody className="p-5 sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Informasi Website
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Informasi dasar yang digunakan pada website.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Name */}
            <SettingField
              label="Nama Website"
              description="Nama utama website."
              icon={<Globe className="h-4 w-4" />}
              value={form.name}
              onChange={(value) => updateForm('name', value)}
              onSave={() => handleSave('name', form.name)}
              isSaving={savingKey === 'app.name' && updateMutation.isPending}
            />

            {/* Email */}
            <SettingField
              label="Email"
              description="Email kontak utama website."
              icon={<Mail className="h-4 w-4" />}
              value={form.email}
              type="email"
              onChange={(value) => updateForm('email', value)}
              onSave={() => handleSave('email', form.email)}
              isSaving={savingKey === 'app.email' && updateMutation.isPending}
            />

            {/* Phone */}
            <SettingField
              label="Nomor Telepon"
              description="Nomor kontak yang dapat dihubungi."
              icon={<Phone className="h-4 w-4" />}
              value={form.phone}
              onChange={(value) => updateForm('phone', value)}
              onSave={() => handleSave('phone', form.phone)}
              isSaving={savingKey === 'app.phone' && updateMutation.isPending}
            />

            {/* Address */}
            <div className="lg:col-span-2">
              <div className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                    <MapPin className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                      Alamat
                    </p>

                    <p className="text-xs text-slate-500">
                      Alamat kantor atau lokasi organisasi.
                    </p>
                  </div>
                </div>

                <Textarea
                  value={form.address}
                  onValueChange={(value) => updateForm('address', value)}
                  placeholder="Masukkan alamat..."
                  minRows={3}
                />

                <div className="flex justify-end">
                  <Button
                    size="sm"
                    color="primary"
                    startContent={
                      savingKey === 'app.address' &&
                      updateMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )
                    }
                    isLoading={
                      savingKey === 'app.address' && updateMutation.isPending
                    }
                    onPress={() => handleSave('address', form.address)}
                    className="font-semibold"
                  >
                    Simpan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Social Media */}
      <Card shadow="none" className="border border-slate-200 bg-white">
        <CardBody className="p-5 sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">Social Media</h2>

            <p className="mt-1 text-sm text-slate-500">
              Kelola link sosial media yang ditampilkan pada website.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <SocialField
              label="Facebook"
              value={form.facebook}
              icon={<FaFacebook className="h-4 w-4" />}
              onChange={(value) => updateForm('facebook', value)}
              onSave={() => handleSave('facebook', form.facebook)}
              isSaving={
                savingKey === 'app.facebook' && updateMutation.isPending
              }
            />

            <SocialField
              label="Instagram"
              value={form.instagram}
              icon={<FaInstagram className="h-4 w-4" />}
              onChange={(value) => updateForm('instagram', value)}
              onSave={() => handleSave('instagram', form.instagram)}
              isSaving={
                savingKey === 'app.instagram' && updateMutation.isPending
              }
            />

            <SocialField
              label="Twitter / X"
              value={form.twitter}
              icon={<span className="text-sm font-bold">𝕏</span>}
              onChange={(value) => updateForm('twitter', value)}
              onSave={() => handleSave('twitter', form.twitter)}
              isSaving={savingKey === 'app.twitter' && updateMutation.isPending}
            />

            <SocialField
              label="YouTube"
              value={form.youtube}
              icon={<FaYoutube className="h-4 w-4" />}
              onChange={(value) => updateForm('youtube', value)}
              onSave={() => handleSave('youtube', form.youtube)}
              isSaving={savingKey === 'app.youtube' && updateMutation.isPending}
            />

            <SocialField
              label="TikTok"
              value={form.tiktok}
              icon={<span className="text-sm font-bold">♪</span>}
              onChange={(value) => updateForm('tiktok', value)}
              onSave={() => handleSave('tiktok', form.tiktok)}
              isSaving={savingKey === 'app.tiktok' && updateMutation.isPending}
            />
          </div>
        </CardBody>
      </Card>

      {/* Logo */}
      <Card shadow="none" className="border border-slate-200 bg-white">
        <CardBody className="p-5 sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">Logo Website</h2>

            <p className="mt-1 text-sm text-slate-500">
              Upload logo yang akan digunakan pada website.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
            {/* Preview */}
            <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
              {logoPreview || logoUrl ? (
                <img
                  src={logoPreview ?? logoUrl}
                  alt="Logo website"
                  className="max-h-36 max-w-full object-contain"
                />
              ) : (
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                    <Globe className="h-6 w-6 text-slate-400" />
                  </div>

                  <p className="mt-3 text-xs text-slate-400">Belum ada logo</p>
                </div>
              )}
            </div>

            {/* Upload */}
            <div className="flex flex-col justify-center">
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  Pilih Logo
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Format yang didukung: JPG, PNG, WEBP. Maksimal ukuran 2 MB.
                </p>

                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleLogoChange}
                  className="hidden"
                />

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Button
                    variant="flat"
                    startContent={<Upload className="h-4 w-4" />}
                    onPress={() => logoInputRef.current?.click()}
                    className="font-semibold"
                  >
                    Pilih File
                  </Button>

                  {logoFile && (
                    <>
                      <Button
                        color="primary"
                        startContent={
                          logoMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )
                        }
                        isLoading={logoMutation.isPending}
                        onPress={handleSaveLogo}
                        className="font-semibold"
                      >
                        Simpan Logo
                      </Button>

                      <Button
                        variant="light"
                        onPress={handleResetLogo}
                        isDisabled={logoMutation.isPending}
                        className="font-semibold text-slate-500"
                      >
                        Batal
                      </Button>
                    </>
                  )}
                </div>

                {logoFile && (
                  <div className="mt-4 rounded-lg bg-green-50 px-3 py-2">
                    <p className="truncate text-xs font-medium text-green-700">
                      {logoFile.name}
                    </p>

                    <p className="mt-0.5 text-[11px] text-green-600">
                      {(logoFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

/*
 * ==========================================
 * NORMAL SETTING FIELD
 * ==========================================
 */

interface SettingFieldProps {
  label: string;
  description: string;
  icon: React.ReactNode;
  value: string;
  type?: string;
  onChange: (value: string) => void;
  onSave: () => void;
  isSaving: boolean;
}

function SettingField({
  label,
  description,
  icon,
  value,
  type = 'text',
  onChange,
  onSave,
  isSaving,
}: SettingFieldProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800">{label}</p>

          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>

      <Input
        type={type}
        value={value}
        onValueChange={onChange}
        placeholder={`Masukkan ${label.toLowerCase()}...`}
      />

      <div className="flex justify-end">
        <Button
          size="sm"
          color="primary"
          startContent={
            isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )
          }
          isLoading={isSaving}
          onPress={onSave}
          className="font-semibold"
        >
          Simpan
        </Button>
      </div>
    </div>
  );
}

/*
 * ==========================================
 * SOCIAL FIELD
 * ==========================================
 */

interface SocialFieldProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  onChange: (value: string) => void;
  onSave: () => void;
  isSaving: boolean;
}

function SocialField({
  label,
  value,
  icon,
  onChange,
  onSave,
  isSaving,
}: SocialFieldProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
          {icon}
        </div>

        <p className="text-sm font-semibold text-slate-800">{label}</p>
      </div>

      <Input
        value={value}
        onValueChange={onChange}
        placeholder={`URL ${label}`}
      />

      <div className="flex justify-end">
        <Button
          size="sm"
          color="primary"
          startContent={
            isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )
          }
          isLoading={isSaving}
          onPress={onSave}
          className="font-semibold"
        >
          Simpan
        </Button>
      </div>
    </div>
  );
}

/*
 * ==========================================
 * SKELETON
 * ==========================================
 */

function SiteSettingSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-40 rounded-lg" />
        <Skeleton className="mt-2 h-4 w-72 rounded-lg" />
      </div>

      <Card shadow="none" className="border border-slate-200">
        <CardBody className="p-5 sm:p-6">
          <Skeleton className="h-6 w-48 rounded-lg" />

          <Skeleton className="mt-2 h-4 w-80 rounded-lg" />

          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 p-4"
              >
                <Skeleton className="h-5 w-32 rounded-lg" />
                <Skeleton className="mt-4 h-10 w-full rounded-lg" />
                <Skeleton className="mt-3 ml-auto h-9 w-20 rounded-lg" />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card shadow="none" className="border border-slate-200">
        <CardBody className="p-5 sm:p-6">
          <Skeleton className="h-6 w-40 rounded-lg" />

          <Skeleton className="mt-2 h-4 w-72 rounded-lg" />

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 p-4"
              >
                <Skeleton className="h-5 w-32 rounded-lg" />
                <Skeleton className="mt-4 h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card shadow="none" className="border border-slate-200">
        <CardBody className="p-5 sm:p-6">
          <Skeleton className="h-6 w-40 rounded-lg" />

          <Skeleton className="mt-2 h-4 w-72 rounded-lg" />

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-40 rounded-xl" />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
