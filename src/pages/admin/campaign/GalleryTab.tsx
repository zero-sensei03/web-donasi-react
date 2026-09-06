import { useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Select,
  SelectItem,
  Skeleton,
  Textarea,
  useDisclosure,
  addToast,
} from '@heroui/react';
import {
  Calendar,
  FileImage,
  Film,
  Image as ImageIcon,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  Video,
  X,
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createGallery,
  deleteGallery,
  getGalleryByCampaignId,
  updateGallery,
} from '@/services/gallery/http';

import type { Gallery, GalleryType } from '@/interfaces/gallery.interface';

import { formatDateTime, toUTCDateTime } from '@/utils/date';

interface GalleryTabProps {
  campaignId: string;
  activeTab: string;
}

interface GalleryForm {
  galleryType: GalleryType;
  title: string;
  description: string;
  timeStamp: string;
}

const ITEMS_PER_PAGE = 10;

const DEFAULT_FORM: GalleryForm = {
  galleryType: 'IMAGE',
  title: '',
  description: '',
  timeStamp: '',
};

const getLocalDateTimeValue = (value?: string): string => {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const pad = (value: number) => String(value).padStart(2, '0');

  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1
  )}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) {
    return '0 Bytes';
  }

  const units = ['Bytes', 'KB', 'MB', 'GB'];

  const index = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
};

export const GalleryTab = ({ campaignId, activeTab }: GalleryTabProps) => {
  const queryClient = useQueryClient();

  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onOpenChange: onFormOpenChange,
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const videoInputRef = useRef<HTMLInputElement | null>(null);

  const [page, setPage] = useState(1);

  useEffect(() => {
    if (activeTab === 'gallery') {
      setPage(1);
    }
  }, [activeTab]);

  const [searchInput, setSearchInput] = useState('');

  const [search, setSearch] = useState('');

  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);

  const [deletingGallery, setDeletingGallery] = useState<Gallery | null>(null);

  const [form, setForm] = useState<GalleryForm>(DEFAULT_FORM);

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  /**
   * Search debounce
   */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 400);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchInput]);

  /**
   * Cleanup blob preview
   */
  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }

      if (videoPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [imagePreview, videoPreview]);

  /**
   * Query Gallery
   */
  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ['campaign-gallery', campaignId, page, ITEMS_PER_PAGE, search],

    queryFn: () =>
      getGalleryByCampaignId(campaignId, {
        page,
        limit: ITEMS_PER_PAGE,
        ...(search
          ? {
              search,
            }
          : {}),
      }),

    enabled: Boolean(campaignId),
  });

  const galleries = data?.items ?? [];

  const totalPages = data?.totalPages ?? 1;

  /**
   * Reset form
   */
  const resetForm = () => {
    if (imagePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }

    if (videoPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(videoPreview);
    }

    setEditingGallery(null);

    setForm({
      ...DEFAULT_FORM,
    });

    setImageFile(null);
    setVideoFile(null);

    setImagePreview(null);
    setVideoPreview(null);

    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }

    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  /**
   * Create
   */
  const handleCreate = () => {
    resetForm();

    setForm({
      ...DEFAULT_FORM,
      timeStamp: getLocalDateTimeValue(new Date().toISOString()),
    });

    onFormOpen();
  };

  /**
   * Edit
   */
  const handleEdit = (gallery: Gallery) => {
    setEditingGallery(gallery);

    setForm({
      galleryType: gallery.galleryType,
      title: gallery.title ?? '',
      description: gallery.description ?? '',
      timeStamp: getLocalDateTimeValue(gallery.timeStamp),
    });

    setImageFile(null);
    setVideoFile(null);

    setImagePreview(gallery.imageUrl);

    setVideoPreview(gallery.videoUrl);

    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }

    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }

    onFormOpen();
  };

  /**
   * Validate image
   */
  const validateImage = (file: File): boolean => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
      addToast({
        title: 'Format image tidak valid',
        description: 'Gunakan JPG, PNG, WebP, atau GIF.',
        color: 'danger',
      });

      return false;
    }

    if (file.size > 15 * 1024 * 1024) {
      addToast({
        title: 'Ukuran image terlalu besar',
        description: 'Ukuran maksimal image adalah 15 MB.',
        color: 'danger',
      });

      return false;
    }

    return true;
  };

  /**
   * Validate video
   */
  const validateVideo = (file: File): boolean => {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];

    if (!allowedTypes.includes(file.type)) {
      addToast({
        title: 'Format video tidak valid',
        description: 'Gunakan MP4, WebM, atau MOV.',
        color: 'danger',
      });

      return false;
    }

    if (file.size > 15 * 1024 * 1024) {
      addToast({
        title: 'Ukuran video terlalu besar',
        description: 'Ukuran maksimal video adalah 15 MB.',
        color: 'danger',
      });

      return false;
    }

    return true;
  };

  /**
   * Select image
   */
  const handleImageChange = (file: File | null) => {
    if (!file) {
      return;
    }

    if (!validateImage(file)) {
      return;
    }

    if (imagePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setImageFile(file);
    setImagePreview(previewUrl);
  };

  /**
   * Select video
   */
  const handleVideoChange = (file: File | null) => {
    if (!file) {
      return;
    }

    if (!validateVideo(file)) {
      return;
    }

    if (videoPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(videoPreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setVideoFile(file);
    setVideoPreview(previewUrl);
  };

  /**
   * Remove / cancel selected image
   *
   * Kalau sedang edit dan ada image lama,
   * kembalikan preview ke image lama.
   */
  const handleRemoveImage = () => {
    if (imagePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(null);

    if (editingGallery?.imageUrl) {
      setImagePreview(editingGallery.imageUrl);
    } else {
      setImagePreview(null);
    }

    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  /**
   * Remove / cancel selected video
   *
   * Kalau sedang edit dan ada video lama,
   * kembalikan preview ke video lama.
   */
  const handleRemoveVideo = () => {
    if (videoPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(videoPreview);
    }

    setVideoFile(null);

    if (editingGallery?.videoUrl) {
      setVideoPreview(editingGallery.videoUrl);
    } else {
      setVideoPreview(null);
    }

    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  /**
   * Create mutation
   */
  const createMutation = useMutation({
    mutationFn: () => {
      if (!imageFile) {
        throw new Error('Image wajib diupload.');
      }

      if (form.galleryType === 'VIDEO' && !videoFile) {
        throw new Error('Video wajib diupload untuk gallery VIDEO.');
      }

      if (!form.timeStamp) {
        throw new Error('Timestamp wajib diisi.');
      }

      return createGallery({
        campaignId,
        galleryType: form.galleryType,
        title: form.title.trim() || undefined,
        description: form.description.trim() || undefined,
        timeStamp: toUTCDateTime(new Date(form.timeStamp)),
        image: imageFile,
        video:
          form.galleryType === 'VIDEO' ? (videoFile ?? undefined) : undefined,
      });
    },

    onSuccess: () => {
      addToast({
        title: 'Gallery berhasil dibuat',
        description: 'Data gallery berhasil ditambahkan.',
        color: 'success',
      });

      queryClient.invalidateQueries({
        queryKey: ['campaign-gallery', campaignId],
      });

      resetForm();
      onFormOpenChange();
    },

    onError: (error: Error) => {
      addToast({
        title: 'Gagal membuat gallery',
        description: error.message || 'Terjadi kesalahan saat membuat gallery.',
        color: 'danger',
      });
    },
  });

  /**
   * Update mutation
   */
  const updateMutation = useMutation({
    mutationFn: () => {
      if (!editingGallery) {
        throw new Error('Gallery tidak ditemukan.');
      }

      if (!form.timeStamp) {
        throw new Error('Timestamp wajib diisi.');
      }

      if (
        form.galleryType === 'VIDEO' &&
        !editingGallery.videoUrl &&
        !videoFile
      ) {
        throw new Error('Video wajib diupload untuk gallery VIDEO.');
      }

      return updateGallery(editingGallery.id, {
        campaignId,
        galleryType: form.galleryType,
        title: form.title.trim() || undefined,
        description: form.description.trim() || undefined,
        timeStamp: toUTCDateTime(new Date(form.timeStamp)),
        image: imageFile ?? undefined,
        video:
          form.galleryType === 'VIDEO' ? (videoFile ?? undefined) : undefined,
      });
    },

    onSuccess: () => {
      addToast({
        title: 'Gallery berhasil diperbarui',
        description: 'Data gallery berhasil diperbarui.',
        color: 'success',
      });

      queryClient.invalidateQueries({
        queryKey: ['campaign-gallery', campaignId],
      });

      resetForm();
      onFormOpenChange();
    },

    onError: (error: Error) => {
      addToast({
        title: 'Gagal memperbarui gallery',
        description:
          error.message || 'Terjadi kesalahan saat memperbarui gallery.',
        color: 'danger',
      });
    },
  });

  /**
   * Delete mutation
   */
  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!deletingGallery) {
        throw new Error('Gallery tidak ditemukan.');
      }

      return deleteGallery(deletingGallery.id);
    },

    onSuccess: () => {
      addToast({
        title: 'Gallery berhasil dihapus',
        description: 'Data gallery berhasil dihapus.',
        color: 'success',
      });

      queryClient.invalidateQueries({
        queryKey: ['campaign-gallery', campaignId],
      });

      setDeletingGallery(null);

      onDeleteOpenChange();
    },

    onError: (error: Error) => {
      addToast({
        title: 'Gagal menghapus gallery',
        description:
          error.message || 'Terjadi kesalahan saat menghapus gallery.',
        color: 'danger',
      });
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  /**
   * Submit
   */
  const handleSubmit = () => {
    if (!form.timeStamp) {
      addToast({
        title: 'Timestamp wajib diisi',
        description: 'Silakan tentukan timestamp gallery.',
        color: 'warning',
      });

      return;
    }

    if (!editingGallery && !imageFile) {
      addToast({
        title: 'Image wajib diupload',
        description: 'Silakan pilih image gallery.',
        color: 'warning',
      });

      return;
    }

    if (
      form.galleryType === 'VIDEO' &&
      !editingGallery?.videoUrl &&
      !videoFile
    ) {
      addToast({
        title: 'Video wajib diupload',
        description: 'Gallery VIDEO membutuhkan file video.',
        color: 'warning',
      });

      return;
    }

    if (editingGallery) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  return (
    <>
      <Card className="border border-slate-200 shadow-sm" shadow="none">
        <CardBody className="p-5 md:p-6">
          {/* Header */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-slate-700" />

                <h2 className="text-lg font-bold text-slate-900">Gallery</h2>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Kelola foto dan video campaign.
              </p>
            </div>

            <Button
              color="primary"
              startContent={<Plus className="h-4 w-4" />}
              onPress={handleCreate}
            >
              Tambah Gallery
            </Button>
          </div>

          {/* Search */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Input
              value={searchInput}
              onValueChange={setSearchInput}
              placeholder="Cari gallery..."
              startContent={<Search className="h-4 w-4 text-slate-400" />}
              isClearable
              onClear={() => setSearchInput('')}
              className="sm:max-w-sm"
            />

            {isFetching && !isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
                Memuat...
              </div>
            )}
          </div>

          {/* Error */}
          {isError && !isLoading && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-6 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-100">
                <X className="h-5 w-5 text-red-600" />
              </div>

              <h3 className="mt-3 font-semibold text-red-900">
                Gagal memuat gallery
              </h3>

              <p className="mt-1 text-sm text-red-700">
                Terjadi kesalahan saat mengambil data gallery.
              </p>

              <Button
                size="sm"
                color="danger"
                variant="flat"
                className="mt-4"
                onPress={() => refetch()}
              >
                Coba Lagi
              </Button>
            </div>
          )}

          {/* Skeleton */}
          {isLoading && (
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({
                length: 6,
              }).map((_, index) => (
                <Card
                  key={index}
                  shadow="none"
                  className="overflow-hidden border border-slate-200"
                >
                  <Skeleton className="aspect-video w-full rounded-none" />

                  <CardBody className="space-y-3">
                    <Skeleton className="h-5 w-2/3 rounded-lg" />

                    <Skeleton className="h-4 w-full rounded-lg" />

                    <Skeleton className="h-4 w-1/2 rounded-lg" />

                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-8 flex-1 rounded-lg" />

                      <Skeleton className="h-8 flex-1 rounded-lg" />
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}

          {/* Empty */}
          {!isLoading && !isError && galleries.length === 0 && (
            <div className="mt-5 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                <ImageIcon className="h-7 w-7 text-slate-400" />
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                {search ? 'Gallery tidak ditemukan' : 'Belum ada gallery'}
              </h3>

              <p className="mt-1 max-w-md text-sm text-slate-500">
                {search
                  ? 'Tidak ada gallery yang sesuai dengan pencarian.'
                  : 'Tambahkan foto atau video pertama untuk campaign ini.'}
              </p>

              {!search && (
                <Button
                  color="primary"
                  variant="flat"
                  startContent={<Plus className="h-4 w-4" />}
                  className="mt-4"
                  onPress={handleCreate}
                >
                  Tambah Gallery
                </Button>
              )}
            </div>
          )}

          {/* Gallery */}
          {!isLoading && !isError && galleries.length > 0 && (
            <>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {galleries.map((gallery) => (
                  <Card
                    key={gallery.id}
                    shadow="none"
                    className="overflow-hidden border border-slate-200 transition-shadow hover:shadow-md"
                  >
                    {/* Media */}
                    <div className="relative aspect-video overflow-hidden bg-slate-100">
                      {gallery.galleryType === 'VIDEO' ? (
                        <video
                          src={gallery.videoUrl ?? undefined}
                          poster={gallery.imageUrl}
                          controls
                          preload="metadata"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <img
                          src={gallery.imageUrl}
                          alt={gallery.title ?? 'Gallery'}
                          className="h-full w-full object-cover"
                        />
                      )}

                      <div className="absolute left-3 top-3">
                        <Chip
                          size="sm"
                          color={
                            gallery.galleryType === 'VIDEO'
                              ? 'secondary'
                              : 'primary'
                          }
                          startContent={
                            gallery.galleryType === 'VIDEO' ? (
                              <Video className="h-3.5 w-3.5" />
                            ) : (
                              <ImageIcon className="h-3.5 w-3.5" />
                            )
                          }
                        >
                          {gallery.galleryType}
                        </Chip>
                      </div>
                    </div>

                    <CardBody className="p-4">
                      <h3 className="line-clamp-1 font-semibold text-slate-900">
                        {gallery.title || 'Tanpa judul'}
                      </h3>

                      <p className="mt-1 line-clamp-2 min-h-[40px] text-sm text-slate-500">
                        {gallery.description || 'Tidak ada deskripsi.'}
                      </p>

                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="h-3.5 w-3.5" />

                        <span>{formatDateTime(gallery.timeStamp)}</span>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Button
                          size="sm"
                          variant="flat"
                          className="flex-1"
                          startContent={<Pencil className="h-3.5 w-3.5" />}
                          onPress={() => handleEdit(gallery)}
                        >
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          color="danger"
                          variant="flat"
                          className="flex-1"
                          startContent={<Trash2 className="h-3.5 w-3.5" />}
                          onPress={() => {
                            setDeletingGallery(gallery);

                            onDeleteOpen();
                          }}
                        >
                          Hapus
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    total={totalPages}
                    page={page}
                    onChange={setPage}
                    showControls
                    color="primary"
                  />
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onOpenChange={(open) => {
          if (!open) {
            resetForm();
          }

          onFormOpenChange();
        }}
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {editingGallery ? 'Edit Gallery' : 'Tambah Gallery'}
              </h2>

              <p className="mt-1 text-sm font-normal text-slate-500">
                Kelola media gallery campaign.
              </p>
            </div>
          </ModalHeader>

          <ModalBody>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* Form */}
              <div className="space-y-4">
                <Select
                  label="Gallery Type"
                  placeholder="Pilih tipe gallery"
                  selectedKeys={[form.galleryType]}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0];

                    if (value === 'IMAGE' || value === 'VIDEO') {
                      setForm((prev) => ({
                        ...prev,
                        galleryType: value,
                      }));
                    }
                  }}
                  isRequired
                >
                  <SelectItem key="IMAGE">Image</SelectItem>

                  <SelectItem key="VIDEO">Video</SelectItem>
                </Select>

                <Input
                  label="Title"
                  placeholder="Masukkan title gallery"
                  value={form.title}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      title: value,
                    }))
                  }
                  maxLength={255}
                />

                <Textarea
                  label="Description"
                  placeholder="Masukkan description gallery"
                  value={form.description}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      description: value,
                    }))
                  }
                  minRows={5}
                  maxRows={8}
                  maxLength={5000}
                />

                <Input
                  type="datetime-local"
                  label="Timestamp"
                  value={form.timeStamp}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      timeStamp: value,
                    }))
                  }
                  isRequired
                />
              </div>

              {/* Upload */}
              <div className="space-y-4">
                {/* IMAGE */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700">
                      Image / Thumbnail
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <span className="text-xs text-slate-400">Maks. 15 MB</span>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="aspect-video w-full object-cover"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-8">
                          <div className="flex items-center gap-2 text-xs text-white">
                            <ImageIcon className="h-4 w-4" />

                            <span>
                              {imageFile
                                ? 'Image baru dipilih'
                                : 'Image saat ini'}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="solid"
                              color="primary"
                              startContent={<Upload className="h-3.5 w-3.5" />}
                              onPress={() => imageInputRef.current?.click()}
                            >
                              Ganti
                            </Button>

                            <Button
                              type="button"
                              size="sm"
                              isIconOnly
                              variant="solid"
                              color="danger"
                              onPress={handleRemoveImage}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <label className="flex cursor-pointer flex-col items-center justify-center px-4 py-10 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                          <FileImage className="h-6 w-6 text-slate-400" />
                        </div>

                        <p className="mt-3 text-sm font-medium text-slate-700">
                          Pilih image
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          JPG, PNG, WebP, GIF
                        </p>

                        <input
                          ref={imageInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="hidden"
                          onChange={(event) => {
                            handleImageChange(event.target.files?.[0] ?? null);

                            event.currentTarget.value = '';
                          }}
                        />
                      </label>
                    )}

                    {/* Hidden input tetap tersedia saat preview ada */}
                    {imagePreview && (
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={(event) => {
                          handleImageChange(event.target.files?.[0] ?? null);

                          event.currentTarget.value = '';
                        }}
                      />
                    )}
                  </div>

                  {imageFile && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                      <Upload className="h-3.5 w-3.5" />

                      <span className="truncate">{imageFile.name}</span>

                      <span>({formatFileSize(imageFile.size)})</span>
                    </div>
                  )}
                </div>

                {/* VIDEO */}
                {form.galleryType === 'VIDEO' && (
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700">
                        Video
                        <span className="ml-1 text-red-500">*</span>
                      </label>

                      <span className="text-xs text-slate-400">
                        Maks. 15 MB
                      </span>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50">
                      {videoPreview ? (
                        <div className="relative">
                          <video
                            src={videoPreview}
                            controls
                            className="aspect-video w-full bg-black object-contain"
                          />

                          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-8">
                            <div className="flex items-center gap-2 text-xs text-white">
                              <Video className="h-4 w-4" />

                              <span>
                                {videoFile
                                  ? 'Video baru dipilih'
                                  : 'Video saat ini'}
                              </span>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="solid"
                                color="secondary"
                                startContent={
                                  <Upload className="h-3.5 w-3.5" />
                                }
                                onPress={() => videoInputRef.current?.click()}
                              >
                                Ganti
                              </Button>

                              <Button
                                type="button"
                                size="sm"
                                isIconOnly
                                variant="solid"
                                color="danger"
                                onPress={handleRemoveVideo}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <label className="flex cursor-pointer flex-col items-center justify-center px-4 py-10 text-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                            <Film className="h-6 w-6 text-slate-400" />
                          </div>

                          <p className="mt-3 text-sm font-medium text-slate-700">
                            Pilih video
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            MP4, WebM, MOV
                          </p>

                          <input
                            ref={videoInputRef}
                            type="file"
                            accept="video/mp4,video/webm,video/quicktime"
                            className="hidden"
                            onChange={(event) => {
                              handleVideoChange(
                                event.target.files?.[0] ?? null
                              );

                              event.currentTarget.value = '';
                            }}
                          />
                        </label>
                      )}

                      {/* Hidden input tetap tersedia saat preview ada */}
                      {videoPreview && (
                        <input
                          ref={videoInputRef}
                          type="file"
                          accept="video/mp4,video/webm,video/quicktime"
                          className="hidden"
                          onChange={(event) => {
                            handleVideoChange(event.target.files?.[0] ?? null);

                            event.currentTarget.value = '';
                          }}
                        />
                      )}
                    </div>

                    {videoFile && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                        <Upload className="h-3.5 w-3.5" />

                        <span className="truncate">{videoFile.name}</span>

                        <span>({formatFileSize(videoFile.size)})</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <div className="flex gap-3">
                    {form.galleryType === 'VIDEO' ? (
                      <Video className="h-5 w-5 shrink-0 text-blue-600" />
                    ) : (
                      <ImageIcon className="h-5 w-5 shrink-0 text-blue-600" />
                    )}

                    <div>
                      <p className="text-sm font-semibold text-blue-900">
                        {form.galleryType === 'VIDEO'
                          ? 'Gallery Video'
                          : 'Gallery Image'}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-blue-700">
                        {form.galleryType === 'VIDEO'
                          ? 'Gallery video membutuhkan image sebagai thumbnail dan file video.'
                          : 'Gallery image hanya membutuhkan file image.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="flat"
              onPress={() => {
                resetForm();
                onFormOpenChange();
              }}
              isDisabled={isSubmitting}
            >
              Batal
            </Button>

            <Button
              color="primary"
              onPress={handleSubmit}
              isLoading={isSubmitting}
            >
              {editingGallery ? 'Simpan Perubahan' : 'Tambah Gallery'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange}>
        <ModalContent>
          <ModalHeader>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Hapus Gallery
              </h2>

              <p className="mt-1 text-sm font-normal text-slate-500">
                Konfirmasi penghapusan gallery.
              </p>
            </div>
          </ModalHeader>

          <ModalBody>
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>

                <div>
                  <p className="font-semibold text-red-900">
                    Yakin ingin menghapus gallery ini?
                  </p>

                  <p className="mt-1 text-sm text-red-700">
                    Gallery{' '}
                    <span className="font-semibold">
                      {deletingGallery?.title || 'Tanpa judul'}
                    </span>{' '}
                    akan dihapus secara permanen.
                  </p>
                </div>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="flat"
              onPress={() => {
                setDeletingGallery(null);

                onDeleteOpenChange();
              }}
              isDisabled={deleteMutation.isPending}
            >
              Batal
            </Button>

            <Button
              color="danger"
              onPress={() => deleteMutation.mutate()}
              isLoading={deleteMutation.isPending}
            >
              Hapus Gallery
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
