import { useEffect, useMemo, useRef, useState } from 'react';

import {
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Skeleton,
  Textarea,
  useDisclosure,
  addToast,
} from '@heroui/react';

import {
  BriefcaseBusiness,
  Camera,
  Edit,
  Eye,
  ImageIcon,
  Plus,
  Search,
  Trash2,
  Upload,
  Users,
} from 'lucide-react';

import { FaInstagram, FaLinkedin } from 'react-icons/fa6';

import {
  createCampaignTim,
  createWorkStructure,
  deleteCampaignTim,
  deleteWorkStructure,
  getAboutByCampaignId,
  updateCampaignTim,
  updateWorkStructure,
  upsertAboutUs,
} from '@/services/about-us/http';

import type {
  CampaignTim,
  WorkStructureDivision,
} from '@/interfaces/about.interface';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface AboutUsTabProps {
  campaignId: string;
  activeTab: string;
}

interface TimForm {
  name: string;
  position: string;
  instagram: string;
  linkedin: string;
}

interface WorkForm {
  divisionName: string;
  divisionJobDescription: string;
}

const ITEMS_PER_PAGE = 6;

const DEFAULT_TIM_FORM: TimForm = {
  name: '',
  position: '',
  instagram: '',
  linkedin: '',
};

const DEFAULT_WORK_FORM: WorkForm = {
  divisionName: '',
  divisionJobDescription: '',
};

const getImageUrl = (image: string | null | undefined): string | null => {
  if (!image) return null;

  return image;
};

export const AboutUsTab = ({ campaignId, activeTab }: AboutUsTabProps) => {
  const queryClient = useQueryClient();

  const timModal = useDisclosure();
  const workModal = useDisclosure();
  const deleteModal = useDisclosure();

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const [aboutForm, setAboutForm] = useState({
    heroTagline: '',
    heroTitle: '',
    heroDescription: '',
    vision: '',
    mission: [''],
  });

  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);

  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);

  const [editingTim, setEditingTim] = useState<CampaignTim | null>(null);

  const [editingWork, setEditingWork] = useState<WorkStructureDivision | null>(
    null
  );

  const [deletingItem, setDeletingItem] = useState<{
    type: 'tim' | 'work';
    id: string;
    name: string;
  } | null>(null);

  const [timForm, setTimForm] = useState<TimForm>(DEFAULT_TIM_FORM);

  const [timImageFile, setTimImageFile] = useState<File | null>(null);

  const [timImagePreview, setTimImagePreview] = useState<string | null>(null);

  const [workForm, setWorkForm] = useState<WorkForm>(DEFAULT_WORK_FORM);

  const [timSearch, setTimSearch] = useState('');
  const [workSearch, setWorkSearch] = useState('');

  const [timPage, setTimPage] = useState(1);
  const [workPage, setWorkPage] = useState(1);

  const [isAboutInitialized, setIsAboutInitialized] = useState(false);

  const {
    data: about,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['campaign-about-us', campaignId],
    queryFn: () => getAboutByCampaignId(campaignId),
    enabled: activeTab === 'about-us' && Boolean(campaignId),
  });

  useEffect(() => {
    if (!about) {
      if (!isLoading && !isAboutInitialized) {
        setAboutForm({
          heroTagline: '',
          heroTitle: '',
          heroDescription: '',
          vision: '',
          mission: [''],
        });

        setHeroImagePreview(null);
        setIsAboutInitialized(true);
      }

      return;
    }

    setAboutForm({
      heroTagline: about.heroTagline ?? '',
      heroTitle: about.heroTitle ?? '',
      heroDescription: about.heroDescription ?? '',
      vision: about.vision ?? '',
      mission: about.mission?.length > 0 ? about.mission : [''],
    });

    setHeroImagePreview(getImageUrl(about.heroBgImage));

    setHeroImageFile(null);
    setIsAboutInitialized(true);
  }, [about, isLoading, isAboutInitialized]);

  useEffect(() => {
    return () => {
      if (heroImagePreview?.startsWith('blob:')) {
        URL.revokeObjectURL(heroImagePreview);
      }

      if (timImagePreview?.startsWith('blob:')) {
        URL.revokeObjectURL(timImagePreview);
      }
    };
  }, [heroImagePreview, timImagePreview]);

  const filteredTim = useMemo(() => {
    const items = about?.CampaignTim ?? [];

    const keyword = timSearch.trim().toLowerCase();

    if (!keyword) return items;

    return items.filter((item) =>
      [item.name, item.position, item.instagram, item.linkedin]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(keyword))
    );
  }, [about?.CampaignTim, timSearch]);

  const filteredWork = useMemo(() => {
    const items = about?.WorkStructureDivision ?? [];

    const keyword = workSearch.trim().toLowerCase();

    if (!keyword) return items;

    return items.filter((item) =>
      [item.divisionName, item.divisionJobDescription]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(keyword))
    );
  }, [about?.WorkStructureDivision, workSearch]);

  const paginatedTim = useMemo(() => {
    const start = (timPage - 1) * ITEMS_PER_PAGE;

    return filteredTim.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTim, timPage]);

  const paginatedWork = useMemo(() => {
    const start = (workPage - 1) * ITEMS_PER_PAGE;

    return filteredWork.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredWork, workPage]);

  const timTotalPages = Math.max(
    1,
    Math.ceil(filteredTim.length / ITEMS_PER_PAGE)
  );

  const workTotalPages = Math.max(
    1,
    Math.ceil(filteredWork.length / ITEMS_PER_PAGE)
  );

  useEffect(() => {
    if (timPage > timTotalPages) {
      setTimPage(timTotalPages);
    }
  }, [timPage, timTotalPages]);

  useEffect(() => {
    if (workPage > workTotalPages) {
      setWorkPage(workTotalPages);
    }
  }, [workPage, workTotalPages]);

  const updateAboutMutation = useMutation({
    mutationFn: () =>
      upsertAboutUs(campaignId, {
        heroTagline: aboutForm.heroTagline.trim() || null,
        heroTitle: aboutForm.heroTitle.trim() || null,
        heroDescription: aboutForm.heroDescription.trim() || null,
        vision: aboutForm.vision.trim() || null,
        mission: aboutForm.mission.map((item) => item.trim()).filter(Boolean),
        image: heroImageFile ?? undefined,
      }),

    onSuccess: () => {
      addToast({
        title: 'Berhasil',
        description: 'Konten About Us berhasil disimpan.',
        color: 'success',
      });

      setHeroImageFile(null);

      queryClient.invalidateQueries({
        queryKey: ['campaign'],
      });
      queryClient.invalidateQueries({
        queryKey: ['campaign-about-us', campaignId],
      });
    },

    onError: (error: any) => {
      addToast({
        title: 'Gagal',
        description:
          error?.response?.data?.message ?? 'Gagal menyimpan konten About Us.',
        color: 'danger',
      });
    },
  });

  const createTimMutation = useMutation({
    mutationFn: () =>
      createCampaignTim({
        aboutUsSectionId: about!.id,
        name: timForm.name.trim(),
        position: timForm.position.trim() || null,
        instagram: timForm.instagram.trim() || null,
        linkedin: timForm.linkedin.trim() || null,
        image: timImageFile ?? undefined,
      }),

    onSuccess: () => {
      addToast({
        title: 'Berhasil',
        description: 'Anggota tim berhasil ditambahkan.',
        color: 'success',
      });

      queryClient.invalidateQueries({
        queryKey: ['campaign-about-us', campaignId],
      });
      queryClient.invalidateQueries({
        queryKey: ['campaign'],
      });

      resetTimForm();
      timModal.onClose();
    },

    onError: (error: any) => {
      addToast({
        title: 'Gagal',
        description:
          error?.response?.data?.message ?? 'Gagal menambahkan anggota tim.',
        color: 'danger',
      });
    },
  });

  const updateTimMutation = useMutation({
    mutationFn: () =>
      updateCampaignTim(editingTim!.id, {
        aboutUsSectionId: about!.id,
        name: timForm.name.trim(),
        position: timForm.position.trim() || null,
        instagram: timForm.instagram.trim() || null,
        linkedin: timForm.linkedin.trim() || null,
        image: timImageFile ?? undefined,
      }),

    onSuccess: () => {
      addToast({
        title: 'Berhasil',
        description: 'Data anggota tim berhasil diperbarui.',
        color: 'success',
      });

      queryClient.invalidateQueries({
        queryKey: ['campaign-about-us', campaignId],
      });
      queryClient.invalidateQueries({
        queryKey: ['campaign'],
      });

      resetTimForm();
      timModal.onClose();
    },

    onError: (error: any) => {
      addToast({
        title: 'Gagal',
        description:
          error?.response?.data?.message ?? 'Gagal memperbarui anggota tim.',
        color: 'danger',
      });
    },
  });

  const createWorkMutation = useMutation({
    mutationFn: () =>
      createWorkStructure({
        aboutUsSectionId: about!.id,
        divisionName: workForm.divisionName.trim(),
        divisionJobDescription: workForm.divisionJobDescription.trim(),
      }),

    onSuccess: () => {
      addToast({
        title: 'Berhasil',
        description: 'Struktur kerja berhasil ditambahkan.',
        color: 'success',
      });

      queryClient.invalidateQueries({
        queryKey: ['campaign-about-us', campaignId],
      });
      queryClient.invalidateQueries({
        queryKey: ['campaign'],
      });

      resetWorkForm();
      workModal.onClose();
    },

    onError: (error: any) => {
      addToast({
        title: 'Gagal',
        description:
          error?.response?.data?.message ?? 'Gagal menambahkan struktur kerja.',
        color: 'danger',
      });
    },
  });

  const updateWorkMutation = useMutation({
    mutationFn: () =>
      updateWorkStructure(editingWork!.id, {
        aboutUsSectionId: about!.id,
        divisionName: workForm.divisionName.trim(),
        divisionJobDescription: workForm.divisionJobDescription.trim(),
      }),

    onSuccess: () => {
      addToast({
        title: 'Berhasil',
        description: 'Struktur kerja berhasil diperbarui.',
        color: 'success',
      });

      queryClient.invalidateQueries({
        queryKey: ['campaign-about-us', campaignId],
      });
      queryClient.invalidateQueries({
        queryKey: ['campaign'],
      });

      resetWorkForm();
      workModal.onClose();
    },

    onError: (error: any) => {
      addToast({
        title: 'Gagal',
        description:
          error?.response?.data?.message ?? 'Gagal memperbarui struktur kerja.',
        color: 'danger',
      });
    },
  });

  const deleteTimMutation = useMutation({
    mutationFn: () => deleteCampaignTim(deletingItem!.id),

    onSuccess: () => {
      addToast({
        title: 'Berhasil',
        description: 'Anggota tim berhasil dihapus.',
        color: 'success',
      });

      queryClient.invalidateQueries({
        queryKey: ['campaign-about-us', campaignId],
      });
      queryClient.invalidateQueries({
        queryKey: ['campaign'],
      });

      deleteModal.onClose();
      setDeletingItem(null);
    },

    onError: (error: any) => {
      addToast({
        title: 'Gagal',
        description:
          error?.response?.data?.message ?? 'Gagal menghapus anggota tim.',
        color: 'danger',
      });
    },
  });

  const deleteWorkMutation = useMutation({
    mutationFn: () => deleteWorkStructure(deletingItem!.id),

    onSuccess: () => {
      addToast({
        title: 'Berhasil',
        description: 'Struktur kerja berhasil dihapus.',
        color: 'success',
      });

      queryClient.invalidateQueries({
        queryKey: ['campaign-about-us', campaignId],
      });
      queryClient.invalidateQueries({
        queryKey: ['campaign'],
      });

      deleteModal.onClose();
      setDeletingItem(null);
    },

    onError: (error: any) => {
      addToast({
        title: 'Gagal',
        description:
          error?.response?.data?.message ?? 'Gagal menghapus struktur kerja.',
        color: 'danger',
      });
    },
  });

  const isSavingAbout = updateAboutMutation.isPending;

  const isSavingTim =
    createTimMutation.isPending || updateTimMutation.isPending;

  const isSavingWork =
    createWorkMutation.isPending || updateWorkMutation.isPending;

  const isDeleting =
    deleteTimMutation.isPending || deleteWorkMutation.isPending;

  const resetTimForm = () => {
    if (timImagePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(timImagePreview);
    }

    setEditingTim(null);
    setTimForm(DEFAULT_TIM_FORM);
    setTimImageFile(null);
    setTimImagePreview(null);

    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const resetWorkForm = () => {
    setEditingWork(null);
    setWorkForm(DEFAULT_WORK_FORM);
  };

  const handleHeroImageChange = (file: File | undefined) => {
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      addToast({
        title: 'Format tidak valid',
        description: 'Gunakan JPG, PNG, atau WebP.',
        color: 'danger',
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      addToast({
        title: 'File terlalu besar',
        description: 'Ukuran gambar maksimal 2 MB.',
        color: 'danger',
      });
      return;
    }

    if (heroImagePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(heroImagePreview);
    }

    setHeroImageFile(file);
    setHeroImagePreview(URL.createObjectURL(file));
  };

  const handleTimImageChange = (file: File | undefined) => {
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      addToast({
        title: 'Format tidak valid',
        description: 'Gunakan JPG, PNG, atau WebP.',
        color: 'danger',
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      addToast({
        title: 'File terlalu besar',
        description: 'Ukuran foto maksimal 2 MB.',
        color: 'danger',
      });
      return;
    }

    if (timImagePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(timImagePreview);
    }

    setTimImageFile(file);
    setTimImagePreview(URL.createObjectURL(file));
  };

  const handleMissionChange = (index: number, value: string) => {
    setAboutForm((prev) => ({
      ...prev,
      mission: prev.mission.map((item, itemIndex) =>
        itemIndex === index ? value : item
      ),
    }));
  };

  const addMission = () => {
    setAboutForm((prev) => ({
      ...prev,
      mission: [...prev.mission, ''],
    }));
  };

  const removeMission = (index: number) => {
    setAboutForm((prev) => {
      const next = prev.mission.filter((_, itemIndex) => itemIndex !== index);

      return {
        ...prev,
        mission: next.length > 0 ? next : [''],
      };
    });
  };

  const openCreateTim = () => {
    resetTimForm();
    timModal.onOpen();
  };

  const openEditTim = (item: CampaignTim) => {
    setEditingTim(item);

    setTimForm({
      name: item.name,
      position: item.position ?? '',
      instagram: item.instagram ?? '',
      linkedin: item.linkedin ?? '',
    });

    setTimImageFile(null);
    setTimImagePreview(getImageUrl(item.image));

    timModal.onOpen();
  };

  const openCreateWork = () => {
    resetWorkForm();
    workModal.onOpen();
  };

  const openEditWork = (item: WorkStructureDivision) => {
    setEditingWork(item);

    setWorkForm({
      divisionName: item.divisionName,
      divisionJobDescription: item.divisionJobDescription,
    });

    workModal.onOpen();
  };

  const openDeleteTim = (item: CampaignTim) => {
    setDeletingItem({
      type: 'tim',
      id: item.id,
      name: item.name,
    });

    deleteModal.onOpen();
  };

  const openDeleteWork = (item: WorkStructureDivision) => {
    setDeletingItem({
      type: 'work',
      id: item.id,
      name: item.divisionName,
    });

    deleteModal.onOpen();
  };

  const handleSaveTim = () => {
    if (!about?.id) {
      addToast({
        title: 'Gagal',
        description: 'About Us belum tersedia.',
        color: 'danger',
      });
      return;
    }

    if (!timForm.name.trim()) {
      addToast({
        title: 'Validasi',
        description: 'Nama anggota tim wajib diisi.',
        color: 'warning',
      });
      return;
    }

    if (editingTim) {
      updateTimMutation.mutate();
      return;
    }

    createTimMutation.mutate();
  };

  const handleSaveWork = () => {
    if (!about?.id) {
      addToast({
        title: 'Gagal',
        description: 'About Us belum tersedia.',
        color: 'danger',
      });
      return;
    }

    if (!workForm.divisionName.trim()) {
      addToast({
        title: 'Validasi',
        description: 'Nama divisi wajib diisi.',
        color: 'warning',
      });
      return;
    }

    if (!workForm.divisionJobDescription.trim()) {
      addToast({
        title: 'Validasi',
        description: 'Deskripsi pekerjaan wajib diisi.',
        color: 'warning',
      });
      return;
    }

    if (editingWork) {
      updateWorkMutation.mutate();
      return;
    }

    createWorkMutation.mutate();
  };

  const handleDelete = () => {
    if (!deletingItem) return;

    if (deletingItem.type === 'tim') {
      deleteTimMutation.mutate();
      return;
    }

    deleteWorkMutation.mutate();
  };

  const renderHeroSkeleton = () => (
    <Card shadow="none" className="border border-slate-200">
      <CardBody className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Skeleton className="rounded-lg">
              <div className="h-10 rounded-lg bg-default-300" />
            </Skeleton>

            <Skeleton className="rounded-lg">
              <div className="h-10 rounded-lg bg-default-300" />
            </Skeleton>

            <Skeleton className="rounded-lg">
              <div className="h-32 rounded-lg bg-default-300" />
            </Skeleton>
          </div>

          <Skeleton className="rounded-xl">
            <div className="h-72 rounded-xl bg-default-300" />
          </Skeleton>
        </div>
      </CardBody>
    </Card>
  );

  if (activeTab !== 'about-us') {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* ABOUT US MAIN CONTENT */}
      {isLoading ? (
        renderHeroSkeleton()
      ) : (
        <Card shadow="none" className="border border-slate-200">
          <CardBody className="p-6">
            <div className="flex flex-col gap-1 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Eye size={18} className="text-blue-600" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    About Us Content
                  </h2>

                  <p className="text-sm text-slate-500">
                    Kelola konten utama halaman About Us campaign.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-5">
                <Input
                  label="Hero Tagline"
                  placeholder="Contoh: Mengenal Lebih Dekat"
                  value={aboutForm.heroTagline}
                  onValueChange={(value) =>
                    setAboutForm((prev) => ({
                      ...prev,
                      heroTagline: value,
                    }))
                  }
                />

                <Input
                  label="Hero Title"
                  placeholder="Tentang ATAC Unsurya"
                  value={aboutForm.heroTitle}
                  onValueChange={(value) =>
                    setAboutForm((prev) => ({
                      ...prev,
                      heroTitle: value,
                    }))
                  }
                />

                <Textarea
                  label="Hero Description"
                  placeholder="Masukkan deskripsi About Us..."
                  minRows={5}
                  value={aboutForm.heroDescription}
                  onValueChange={(value) =>
                    setAboutForm((prev) => ({
                      ...prev,
                      heroDescription: value,
                    }))
                  }
                />

                <Textarea
                  label="Vision"
                  placeholder="Masukkan visi campaign..."
                  minRows={4}
                  value={aboutForm.vision}
                  onValueChange={(value) =>
                    setAboutForm((prev) => ({
                      ...prev,
                      vision: value,
                    }))
                  }
                />
              </div>

              <div className="space-y-5">
                {/* HERO IMAGE */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Hero Background Image
                  </label>

                  <div className="relative overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50">
                    {heroImagePreview ? (
                      <div className="relative aspect-video">
                        <img
                          src={heroImagePreview}
                          alt="Hero preview"
                          className="w-full h-full object-cover"
                        />

                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="solid"
                            color="primary"
                            startContent={<Upload size={16} />}
                            onPress={() =>
                              document
                                .getElementById('about-hero-image-input')
                                ?.click()
                            }
                          >
                            Ganti Gambar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="w-full aspect-video flex flex-col items-center justify-center gap-3 hover:bg-slate-100 transition-colors"
                        onClick={() =>
                          document
                            .getElementById('about-hero-image-input')
                            ?.click()
                        }
                      >
                        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center">
                          <ImageIcon size={25} className="text-slate-400" />
                        </div>

                        <div className="text-center">
                          <p className="text-sm font-semibold text-slate-700">
                            Upload Hero Image
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            JPG, PNG, WebP · Maks. 2 MB
                          </p>
                        </div>
                      </button>
                    )}

                    <input
                      id="about-hero-image-input"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(event) => {
                        handleHeroImageChange(event.target.files?.[0]);

                        event.currentTarget.value = '';
                      }}
                    />
                  </div>
                </div>

                {/* MISSION */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700">
                      Mission
                    </label>

                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      startContent={<Plus size={15} />}
                      onPress={addMission}
                    >
                      Tambah Misi
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {aboutForm.mission.map((mission, index) => (
                      <div key={`mission-${index}`} className="flex gap-2">
                        <Textarea
                          minRows={2}
                          placeholder={`Misi ${index + 1}`}
                          value={mission}
                          onValueChange={(value) =>
                            handleMissionChange(index, value)
                          }
                          className="flex-1"
                        />

                        <Button
                          isIconOnly
                          variant="light"
                          color="danger"
                          className="mt-1"
                          onPress={() => removeMission(index)}
                        >
                          <Trash2 size={17} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Divider className="my-6" />

            <div className="flex justify-end">
              <Button
                color="primary"
                isLoading={isSavingAbout}
                onPress={() => updateAboutMutation.mutate()}
              >
                Simpan About Us
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* TEAM */}
      <Card shadow="none" className="border border-slate-200">
        <CardBody className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Users size={20} className="text-emerald-600" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">Tim</h2>

                <p className="text-sm text-slate-500">
                  Kelola anggota tim campaign.
                </p>
              </div>
            </div>

            <Button
              color="primary"
              startContent={<Plus size={17} />}
              onPress={openCreateTim}
              isDisabled={!about}
            >
              Tambah Anggota
            </Button>
          </div>

          <div className="mb-5">
            <Input
              isClearable
              placeholder="Cari nama atau jabatan..."
              startContent={<Search size={18} className="text-slate-400" />}
              value={timSearch}
              onValueChange={(value) => {
                setTimSearch(value);
                setTimPage(1);
              }}
              onClear={() => {
                setTimSearch('');
                setTimPage(1);
              }}
            />
          </div>

          {isError ? (
            <div className="py-12 text-center">
              <p className="text-sm text-red-500 mb-3">
                Gagal memuat data About Us.
              </p>

              <Button size="sm" variant="flat" onPress={() => refetch()}>
                Coba Lagi
              </Button>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({
                length: 6,
              }).map((_, index) => (
                <Card
                  key={index}
                  shadow="none"
                  className="border border-slate-200"
                >
                  <CardBody className="p-4">
                    <Skeleton className="rounded-xl">
                      <div className="h-52 rounded-xl bg-default-300" />
                    </Skeleton>

                    <div className="space-y-2 mt-4">
                      <Skeleton className="rounded-lg">
                        <div className="h-5 rounded-lg bg-default-300" />
                      </Skeleton>

                      <Skeleton className="rounded-lg">
                        <div className="h-4 rounded-lg bg-default-300" />
                      </Skeleton>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : paginatedTim.length === 0 ? (
            <div className="py-14 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <Users size={28} className="text-slate-400" />
              </div>

              <h3 className="font-semibold text-slate-800">
                {timSearch ? 'Tim tidak ditemukan' : 'Belum ada anggota tim'}
              </h3>

              <p className="text-sm text-slate-500 mt-1 max-w-md">
                {timSearch
                  ? 'Coba gunakan kata kunci pencarian lain.'
                  : 'Tambahkan anggota tim untuk ditampilkan pada halaman About Us.'}
              </p>

              {!timSearch && (
                <Button
                  className="mt-4"
                  color="primary"
                  size="sm"
                  startContent={<Plus size={16} />}
                  onPress={openCreateTim}
                  isDisabled={!about}
                >
                  Tambah Anggota
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {paginatedTim.map((item) => {
                  const image = getImageUrl(item.image);

                  return (
                    <Card
                      key={item.id}
                      shadow="none"
                      className="border border-slate-200 overflow-hidden group"
                    >
                      <CardBody className="p-0">
                        <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                          {image ? (
                            <img
                              src={image}
                              alt={item.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center">
                              <Users size={42} className="text-slate-300" />

                              <span className="text-xs text-slate-400 mt-2">
                                Tidak ada foto
                              </span>
                            </div>
                          )}

                          <div className="absolute top-3 right-3 flex gap-2">
                            <Button
                              isIconOnly
                              size="sm"
                              radius="full"
                              className="bg-white/95 shadow-sm"
                              onPress={() => openEditTim(item)}
                            >
                              <Edit size={15} />
                            </Button>

                            <Button
                              isIconOnly
                              size="sm"
                              radius="full"
                              color="danger"
                              className="bg-white/95 shadow-sm"
                              onPress={() => openDeleteTim(item)}
                            >
                              <Trash2 size={15} />
                            </Button>
                          </div>
                        </div>

                        <div className="p-4">
                          <h3 className="font-bold text-slate-900">
                            {item.name}
                          </h3>

                          {item.position ? (
                            <p className="text-sm text-blue-600 font-medium mt-1">
                              {item.position}
                            </p>
                          ) : (
                            <p className="text-sm text-slate-400 mt-1">
                              Jabatan belum diisi
                            </p>
                          )}

                          {(item.instagram || item.linkedin) && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {item.instagram && (
                                <Chip
                                  size="sm"
                                  variant="flat"
                                  startContent={<FaInstagram size={13} />}
                                >
                                  Instagram
                                </Chip>
                              )}

                              {item.linkedin && (
                                <Chip
                                  size="sm"
                                  variant="flat"
                                  startContent={<FaLinkedin size={13} />}
                                >
                                  LinkedIn
                                </Chip>
                              )}
                            </div>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  );
                })}
              </div>

              {timTotalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    total={timTotalPages}
                    page={timPage}
                    onChange={setTimPage}
                    showControls
                  />
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>

      {/* WORK STRUCTURE */}
      <Card shadow="none" className="border border-slate-200">
        <CardBody className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                <BriefcaseBusiness size={20} className="text-violet-600" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Work Structure
                </h2>

                <p className="text-sm text-slate-500">
                  Kelola divisi dan job description tim.
                </p>
              </div>
            </div>

            <Button
              color="primary"
              startContent={<Plus size={17} />}
              onPress={openCreateWork}
              isDisabled={!about}
            >
              Tambah Divisi
            </Button>
          </div>

          <div className="mb-5">
            <Input
              isClearable
              placeholder="Cari divisi atau job description..."
              startContent={<Search size={18} className="text-slate-400" />}
              value={workSearch}
              onValueChange={(value) => {
                setWorkSearch(value);
                setWorkPage(1);
              }}
              onClear={() => {
                setWorkSearch('');
                setWorkPage(1);
              }}
            />
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({
                length: 5,
              }).map((_, index) => (
                <Card
                  key={index}
                  shadow="none"
                  className="border border-slate-200"
                >
                  <CardBody className="p-5">
                    <Skeleton className="rounded-lg">
                      <div className="h-5 rounded-lg bg-default-300" />
                    </Skeleton>

                    <Skeleton className="rounded-lg mt-3">
                      <div className="h-14 rounded-lg bg-default-300" />
                    </Skeleton>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : paginatedWork.length === 0 ? (
            <div className="py-14 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <BriefcaseBusiness size={28} className="text-slate-400" />
              </div>

              <h3 className="font-semibold text-slate-800">
                {workSearch
                  ? 'Divisi tidak ditemukan'
                  : 'Belum ada struktur kerja'}
              </h3>

              <p className="text-sm text-slate-500 mt-1 max-w-md">
                {workSearch
                  ? 'Coba gunakan kata kunci pencarian lain.'
                  : 'Tambahkan divisi dan job description untuk struktur kerja campaign.'}
              </p>

              {!workSearch && (
                <Button
                  className="mt-4"
                  color="primary"
                  size="sm"
                  startContent={<Plus size={16} />}
                  onPress={openCreateWork}
                  isDisabled={!about}
                >
                  Tambah Divisi
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {paginatedWork.map((item) => (
                  <Card
                    key={item.id}
                    shadow="none"
                    className="border border-slate-200"
                  >
                    <CardBody className="p-5">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex gap-4 min-w-0">
                          <div className="w-11 h-11 shrink-0 rounded-xl bg-violet-50 flex items-center justify-center">
                            <BriefcaseBusiness
                              size={20}
                              className="text-violet-600"
                            />
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-bold text-slate-900">
                              {item.divisionName}
                            </h3>

                            <p className="text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                              {item.divisionJobDescription}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 shrink-0">
                          <Button
                            size="sm"
                            variant="flat"
                            startContent={<Edit size={15} />}
                            onPress={() => openEditWork(item)}
                          >
                            Edit
                          </Button>

                          <Button
                            size="sm"
                            variant="flat"
                            color="danger"
                            startContent={<Trash2 size={15} />}
                            onPress={() => openDeleteWork(item)}
                          >
                            Hapus
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>

              {workTotalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    total={workTotalPages}
                    page={workPage}
                    onChange={setWorkPage}
                    showControls
                  />
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>

      {/* TIM MODAL */}
      <Modal
        isOpen={timModal.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            resetTimForm();
          }

          timModal.onOpenChange();
        }}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>
            {editingTim ? 'Edit Anggota Tim' : 'Tambah Anggota Tim'}
          </ModalHeader>

          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* IMAGE */}
              <div className="md:row-span-3">
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Foto Anggota
                </label>

                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 overflow-hidden">
                  {timImagePreview ? (
                    <div className="relative aspect-square">
                      <img
                        src={timImagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent pt-10">
                        <Button
                          size="sm"
                          className="w-full"
                          color="primary"
                          startContent={<Camera size={15} />}
                          onPress={() => imageInputRef.current?.click()}
                        >
                          Ganti Foto
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="w-full aspect-square flex flex-col items-center justify-center gap-3 hover:bg-slate-100 transition-colors"
                      onClick={() => imageInputRef.current?.click()}
                    >
                      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center">
                        <Camera size={25} className="text-slate-400" />
                      </div>

                      <div className="text-center px-4">
                        <p className="text-sm font-semibold text-slate-700">
                          Upload Foto
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          JPG, PNG, WebP · Maks. 2 MB
                        </p>
                      </div>
                    </button>
                  )}

                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(event) => {
                      handleTimImageChange(event.target.files?.[0]);

                      event.currentTarget.value = '';
                    }}
                  />
                </div>
              </div>

              <Input
                label="Nama"
                isRequired
                placeholder="Nama anggota tim"
                value={timForm.name}
                onValueChange={(value) =>
                  setTimForm((prev) => ({
                    ...prev,
                    name: value,
                  }))
                }
              />

              <Input
                label="Jabatan"
                placeholder="Contoh: Ketua Tim"
                value={timForm.position}
                onValueChange={(value) =>
                  setTimForm((prev) => ({
                    ...prev,
                    position: value,
                  }))
                }
              />

              <Input
                label="Instagram"
                placeholder="@username"
                startContent={
                  <FaInstagram size={16} className="text-slate-400" />
                }
                value={timForm.instagram}
                onValueChange={(value) =>
                  setTimForm((prev) => ({
                    ...prev,
                    instagram: value,
                  }))
                }
              />

              <Input
                label="LinkedIn"
                placeholder="URL atau username LinkedIn"
                startContent={
                  <FaLinkedin size={16} className="text-slate-400" />
                }
                value={timForm.linkedin}
                onValueChange={(value) =>
                  setTimForm((prev) => ({
                    ...prev,
                    linkedin: value,
                  }))
                }
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="flat"
              onPress={() => {
                resetTimForm();
                timModal.onClose();
              }}
              isDisabled={isSavingTim}
            >
              Batal
            </Button>

            <Button
              color="primary"
              isLoading={isSavingTim}
              onPress={handleSaveTim}
            >
              {editingTim ? 'Simpan Perubahan' : 'Tambah Anggota'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* WORK MODAL */}
      <Modal
        isOpen={workModal.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            resetWorkForm();
          }

          workModal.onOpenChange();
        }}
        size="2xl"
      >
        <ModalContent>
          <ModalHeader>
            {editingWork ? 'Edit Struktur Kerja' : 'Tambah Struktur Kerja'}
          </ModalHeader>

          <ModalBody>
            <Input
              label="Nama Divisi"
              isRequired
              placeholder="Contoh: Divisi Riset dan Pengembangan"
              value={workForm.divisionName}
              onValueChange={(value) =>
                setWorkForm((prev) => ({
                  ...prev,
                  divisionName: value,
                }))
              }
            />

            <Textarea
              label="Job Description"
              isRequired
              placeholder="Jelaskan tanggung jawab dan pekerjaan divisi..."
              minRows={7}
              value={workForm.divisionJobDescription}
              onValueChange={(value) =>
                setWorkForm((prev) => ({
                  ...prev,
                  divisionJobDescription: value,
                }))
              }
            />
          </ModalBody>

          <ModalFooter>
            <Button
              variant="flat"
              onPress={() => {
                resetWorkForm();
                workModal.onClose();
              }}
              isDisabled={isSavingWork}
            >
              Batal
            </Button>

            <Button
              color="primary"
              isLoading={isSavingWork}
              onPress={handleSaveWork}
            >
              {editingWork ? 'Simpan Perubahan' : 'Tambah Divisi'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* DELETE MODAL */}
      <Modal
        isOpen={deleteModal.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingItem(null);
          }

          deleteModal.onOpenChange();
        }}
        size="sm"
      >
        <ModalContent>
          <ModalHeader>Konfirmasi Hapus</ModalHeader>

          <ModalBody>
            <div className="flex flex-col items-center text-center py-2">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <Trash2 size={25} className="text-red-500" />
              </div>

              <h3 className="font-semibold text-slate-900">Hapus data ini?</h3>

              <p className="text-sm text-slate-500 mt-2">
                Data{' '}
                <span className="font-semibold text-slate-700">
                  {deletingItem?.name}
                </span>{' '}
                akan dihapus secara permanen.
              </p>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="flat"
              onPress={() => {
                setDeletingItem(null);
                deleteModal.onClose();
              }}
              isDisabled={isDeleting}
            >
              Batal
            </Button>

            <Button
              color="danger"
              isLoading={isDeleting}
              onPress={handleDelete}
            >
              Hapus
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
