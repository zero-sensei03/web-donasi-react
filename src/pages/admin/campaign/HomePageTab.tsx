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
  Edit,
  ImageIcon,
  Lightbulb,
  Plus,
  Search,
  Target,
  Trash2,
  Upload,
  Users,
} from 'lucide-react';

import {
  createSupportWork,
  createWhySection,
  deleteSupportWork,
  deleteWhySection,
  getHomePageByCampaignId,
  updateSupportWork,
  updateWhySection,
  upsertHomePage,
} from '@/services/home-page/http';

import type {
  SupportWorkSection,
  WhySection,
} from '@/interfaces/home-page.interface';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface HomePageTabProps {
  campaignId: string;
  activeTab: string;
}

interface WhyForm {
  title: string;
  subTitle: string;
}

interface SupportWorkForm {
  order: string;
  title: string;
  description: string;
  tagline: string;
  focus: string[];
}

const ITEMS_PER_PAGE = 6;

const DEFAULT_WHY_FORM: WhyForm = {
  title: '',
  subTitle: '',
};

const DEFAULT_SUPPORT_WORK_FORM: SupportWorkForm = {
  order: '',
  title: '',
  description: '',
  tagline: '',
  focus: [''],
};

const getImageUrl = (value: string | null | undefined) => {
  if (!value) return null;

  return value;
};

export const HomePageTab = ({ campaignId, activeTab }: HomePageTabProps) => {
  const queryClient = useQueryClient();

  const whyModal = useDisclosure();
  const supportModal = useDisclosure();
  const deleteModal = useDisclosure();

  const heroInputRef = useRef<HTMLInputElement | null>(null);

  const ctaInputRef = useRef<HTMLInputElement | null>(null);

  const whyImageInputRef = useRef<HTMLInputElement | null>(null);

  const supportImageInputRef = useRef<HTMLInputElement | null>(null);

  const [homeForm, setHomeForm] = useState({
    heroTagline: '',
    heroTitle: '',
    heroDescription: '',
    whyHomeDescription: '',
    supportWorkTagline: '',
    supportWorkDescription: '',
    ctaSectionTagline: '',
    ctaSectionTitle: '',
    ctaSectionSubtitle: '',
  });

  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);

  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);

  const [ctaImageFile, setCtaImageFile] = useState<File | null>(null);

  const [ctaImagePreview, setCtaImagePreview] = useState<string | null>(null);

  const [editingWhy, setEditingWhy] = useState<WhySection | null>(null);

  const [whyForm, setWhyForm] = useState<WhyForm>(DEFAULT_WHY_FORM);

  const [whyImageFile, setWhyImageFile] = useState<File | null>(null);

  const [whyImagePreview, setWhyImagePreview] = useState<string | null>(null);

  const [editingSupport, setEditingSupport] =
    useState<SupportWorkSection | null>(null);

  const [supportWorkForm, setSupportWorkForm] = useState<SupportWorkForm>(
    DEFAULT_SUPPORT_WORK_FORM
  );

  const [supportImageFile, setSupportImageFile] = useState<File | null>(null);

  const [supportImagePreview, setSupportImagePreview] = useState<string | null>(
    null
  );

  const [whySearch, setWhySearch] = useState('');

  const [supportSearch, setSupportSearch] = useState('');

  const [whyPage, setWhyPage] = useState(1);

  const [supportPage, setSupportPage] = useState(1);

  const [deletingItem, setDeletingItem] = useState<{
    type: 'why' | 'support';
    id: string;
    name: string;
  } | null>(null);

  const { data: home, isLoading } = useQuery({
    queryKey: ['campaign-home-page', campaignId],
    queryFn: () => getHomePageByCampaignId(campaignId),
    enabled: activeTab === 'homepage' && Boolean(campaignId),
  });

  useEffect(() => {
    if (!home) {
      if (!isLoading) {
        setHomeForm({
          heroTagline: '',
          heroTitle: '',
          heroDescription: '',
          whyHomeDescription: '',
          supportWorkTagline: '',
          supportWorkDescription: '',
          ctaSectionTagline: '',
          ctaSectionTitle: '',
          ctaSectionSubtitle: '',
        });

        setHeroImagePreview(null);
        setCtaImagePreview(null);
      }

      return;
    }

    setHomeForm({
      heroTagline: home.heroTagline ?? '',
      heroTitle: home.heroTitle ?? '',
      heroDescription: home.heroDescription ?? '',
      whyHomeDescription: home.whyHomeDescription ?? '',
      supportWorkTagline: home.supportWorkTagline ?? '',
      supportWorkDescription: home.supportWorkDescription ?? '',
      ctaSectionTagline: home.ctaSectionTagline ?? '',
      ctaSectionTitle: home.ctaSectionTitle ?? '',
      ctaSectionSubtitle: home.ctaSectionSubtitle ?? '',
    });

    setHeroImagePreview(getImageUrl(home.heroBgImage));

    setCtaImagePreview(getImageUrl(home.ctaSectionBgImage));

    setHeroImageFile(null);
    setCtaImageFile(null);
  }, [home, isLoading]);

  useEffect(() => {
    return () => {
      const previews = [
        heroImagePreview,
        ctaImagePreview,
        whyImagePreview,
        supportImagePreview,
      ];

      previews.forEach((preview) => {
        if (preview?.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [heroImagePreview, ctaImagePreview, whyImagePreview, supportImagePreview]);

  const filteredWhy = useMemo(() => {
    const items = home?.whySection ?? [];

    const keyword = whySearch.trim().toLowerCase();

    if (!keyword) return items;

    return items.filter((item) =>
      [item.title, item.subTitle]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(keyword))
    );
  }, [home?.whySection, whySearch]);

  const filteredSupport = useMemo(() => {
    const items = home?.supportWorkSection ?? [];

    const keyword = supportSearch.trim().toLowerCase();

    if (!keyword) return items;

    return items.filter((item) =>
      [item.title, item.description, item.tagline, ...item.focus]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(keyword))
    );
  }, [home?.supportWorkSection, supportSearch]);

  const paginatedWhy = useMemo(() => {
    const start = (whyPage - 1) * ITEMS_PER_PAGE;

    return filteredWhy.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredWhy, whyPage]);

  const paginatedSupport = useMemo(() => {
    const start = (supportPage - 1) * ITEMS_PER_PAGE;

    return filteredSupport.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSupport, supportPage]);

  const whyTotalPages = Math.max(
    1,
    Math.ceil(filteredWhy.length / ITEMS_PER_PAGE)
  );

  const supportTotalPages = Math.max(
    1,
    Math.ceil(filteredSupport.length / ITEMS_PER_PAGE)
  );

  useEffect(() => {
    if (whyPage > whyTotalPages) {
      setWhyPage(whyTotalPages);
    }
  }, [whyPage, whyTotalPages]);

  useEffect(() => {
    if (supportPage > supportTotalPages) {
      setSupportPage(supportTotalPages);
    }
  }, [supportPage, supportTotalPages]);

  const updateHomeMutation = useMutation({
    mutationFn: () =>
      upsertHomePage(campaignId, {
        heroTagline: homeForm.heroTagline.trim() || null,
        heroTitle: homeForm.heroTitle.trim() || null,
        heroDescription: homeForm.heroDescription.trim() || null,

        whyHomeDescription: homeForm.whyHomeDescription.trim() || null,

        supportWorkTagline: homeForm.supportWorkTagline.trim() || null,

        supportWorkDescription: homeForm.supportWorkDescription.trim() || null,

        ctaSectionTagline: homeForm.ctaSectionTagline.trim() || null,

        ctaSectionTitle: homeForm.ctaSectionTitle.trim() || null,

        ctaSectionSubtitle: homeForm.ctaSectionSubtitle.trim() || null,

        heroImage: heroImageFile ?? undefined,

        ctaImage: ctaImageFile ?? undefined,
      }),

    onSuccess: () => {
      addToast({
        title: 'Berhasil',
        description: 'Homepage berhasil disimpan.',
        color: 'success',
      });

      queryClient.invalidateQueries({
        queryKey: ['campaign-home-page', campaignId],
      });
      queryClient.invalidateQueries({
        queryKey: ['campaign'],
      });

      setHeroImageFile(null);
      setCtaImageFile(null);
    },

    onError: (error: any) => {
      addToast({
        title: 'Gagal',
        description:
          error?.response?.data?.message ?? 'Gagal menyimpan Homepage.',
        color: 'danger',
      });
    },
  });

  const createWhyMutation = useMutation({
    mutationFn: () =>
      createWhySection({
        homePageSectionId: home!.id,
        title: whyForm.title.trim(),
        subTitle: whyForm.subTitle.trim() || null,
        image: whyImageFile ?? undefined,
      }),

    onSuccess: () => {
      addToast({
        title: 'Berhasil',
        description: 'Why Section berhasil ditambahkan.',
        color: 'success',
      });

      queryClient.invalidateQueries({
        queryKey: ['campaign-home-page', campaignId],
      });
      queryClient.invalidateQueries({
        queryKey: ['campaign'],
      });

      resetWhyForm();
      whyModal.onClose();
    },

    onError: (error: any) => {
      addToast({
        title: 'Gagal',
        description:
          error?.response?.data?.message ?? 'Gagal menambahkan Why Section.',
        color: 'danger',
      });
    },
  });

  const updateWhyMutation = useMutation({
    mutationFn: () =>
      updateWhySection(editingWhy!.id, {
        homePageSectionId: home!.id,
        title: whyForm.title.trim(),
        subTitle: whyForm.subTitle.trim() || null,
        image: whyImageFile ?? undefined,
      }),

    onSuccess: () => {
      addToast({
        title: 'Berhasil',
        description: 'Why Section berhasil diperbarui.',
        color: 'success',
      });

      queryClient.invalidateQueries({
        queryKey: ['campaign-home-page', campaignId],
      });
      queryClient.invalidateQueries({
        queryKey: ['campaign'],
      });

      resetWhyForm();
      whyModal.onClose();
    },

    onError: (error: any) => {
      addToast({
        title: 'Gagal',
        description:
          error?.response?.data?.message ?? 'Gagal memperbarui Why Section.',
        color: 'danger',
      });
    },
  });

  const createSupportMutation = useMutation({
    mutationFn: () =>
      createSupportWork({
        homePageSectionId: home!.id,
        order: Number(supportWorkForm.order),
        title: supportWorkForm.title.trim(),
        description: supportWorkForm.description.trim() || null,
        tagline: supportWorkForm.tagline.trim() || null,
        focus: supportWorkForm.focus.map((item) => item.trim()).filter(Boolean),
        image: supportImageFile ?? undefined,
      }),

    onSuccess: () => {
      addToast({
        title: 'Berhasil',
        description: 'Support Work berhasil ditambahkan.',
        color: 'success',
      });

      queryClient.invalidateQueries({
        queryKey: ['campaign-home-page', campaignId],
      });
      queryClient.invalidateQueries({
        queryKey: ['campaign'],
      });

      resetSupportForm();
      supportModal.onClose();
    },

    onError: (error: any) => {
      addToast({
        title: 'Gagal',
        description:
          error?.response?.data?.message ?? 'Gagal menambahkan Support Work.',
        color: 'danger',
      });
    },
  });

  const updateSupportMutation = useMutation({
    mutationFn: () =>
      updateSupportWork(editingSupport!.id, {
        homePageSectionId: home!.id,
        order: Number(supportWorkForm.order),
        title: supportWorkForm.title.trim(),
        description: supportWorkForm.description.trim() || null,
        tagline: supportWorkForm.tagline.trim() || null,
        focus: supportWorkForm.focus.map((item) => item.trim()).filter(Boolean),
        image: supportImageFile ?? undefined,
      }),

    onSuccess: () => {
      addToast({
        title: 'Berhasil',
        description: 'Support Work berhasil diperbarui.',
        color: 'success',
      });

      queryClient.invalidateQueries({
        queryKey: ['campaign-home-page', campaignId],
      });
      queryClient.invalidateQueries({
        queryKey: ['campaign'],
      });

      resetSupportForm();
      supportModal.onClose();
    },

    onError: (error: any) => {
      addToast({
        title: 'Gagal',
        description:
          error?.response?.data?.message ?? 'Gagal memperbarui Support Work.',
        color: 'danger',
      });
    },
  });

  const deleteWhyMutation = useMutation({
    mutationFn: () => deleteWhySection(deletingItem!.id),

    onSuccess: () => {
      addToast({
        title: 'Berhasil',
        description: 'Why Section berhasil dihapus.',
        color: 'success',
      });

      queryClient.invalidateQueries({
        queryKey: ['campaign-home-page', campaignId],
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
          error?.response?.data?.message ?? 'Gagal menghapus Why Section.',
        color: 'danger',
      });
    },
  });

  const deleteSupportMutation = useMutation({
    mutationFn: () => deleteSupportWork(deletingItem!.id),

    onSuccess: () => {
      addToast({
        title: 'Berhasil',
        description: 'Support Work berhasil dihapus.',
        color: 'success',
      });

      queryClient.invalidateQueries({
        queryKey: ['campaign-home-page', campaignId],
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
          error?.response?.data?.message ?? 'Gagal menghapus Support Work.',
        color: 'danger',
      });
    },
  });

  const resetWhyForm = () => {
    if (whyImagePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(whyImagePreview);
    }

    setEditingWhy(null);
    setWhyForm(DEFAULT_WHY_FORM);
    setWhyImageFile(null);
    setWhyImagePreview(null);

    if (whyImageInputRef.current) {
      whyImageInputRef.current.value = '';
    }
  };

  const resetSupportForm = () => {
    if (supportImagePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(supportImagePreview);
    }

    setEditingSupport(null);
    setSupportWorkForm(DEFAULT_SUPPORT_WORK_FORM);
    setSupportImageFile(null);
    setSupportImagePreview(null);

    if (supportImageInputRef.current) {
      supportImageInputRef.current.value = '';
    }
  };

  const validateImage = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      addToast({
        title: 'Format tidak valid',
        description: 'Gunakan JPG, PNG, atau WebP.',
        color: 'danger',
      });

      return false;
    }

    if (file.size > 2 * 1024 * 1024) {
      addToast({
        title: 'File terlalu besar',
        description: 'Ukuran gambar maksimal 2 MB.',
        color: 'danger',
      });

      return false;
    }

    return true;
  };

  const handleHeroImageChange = (file?: File) => {
    if (!file) return;

    if (!validateImage(file)) {
      return;
    }

    if (heroImagePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(heroImagePreview);
    }

    setHeroImageFile(file);
    setHeroImagePreview(URL.createObjectURL(file));
  };

  const handleCtaImageChange = (file?: File) => {
    if (!file) return;

    if (!validateImage(file)) {
      return;
    }

    if (ctaImagePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(ctaImagePreview);
    }

    setCtaImageFile(file);
    setCtaImagePreview(URL.createObjectURL(file));
  };

  const handleWhyImageChange = (file?: File) => {
    if (!file) return;

    if (!validateImage(file)) {
      return;
    }

    if (whyImagePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(whyImagePreview);
    }

    setWhyImageFile(file);
    setWhyImagePreview(URL.createObjectURL(file));
  };

  const handleSupportImageChange = (file?: File) => {
    if (!file) return;

    if (!validateImage(file)) {
      return;
    }

    if (supportImagePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(supportImagePreview);
    }

    setSupportImageFile(file);
    setSupportImagePreview(URL.createObjectURL(file));
  };

  const openCreateWhy = () => {
    resetWhyForm();
    whyModal.onOpen();
  };

  const openEditWhy = (item: WhySection) => {
    setEditingWhy(item);

    setWhyForm({
      title: item.title,
      subTitle: item.subTitle ?? '',
    });

    setWhyImageFile(null);
    setWhyImagePreview(getImageUrl(item.icon));

    whyModal.onOpen();
  };

  const openCreateSupport = () => {
    resetSupportForm();
    supportModal.onOpen();
  };

  const openEditSupport = (item: SupportWorkSection) => {
    setEditingSupport(item);

    setSupportWorkForm({
      order: String(item.order),
      title: item.title,
      description: item.description ?? '',
      tagline: item.tagline ?? '',
      focus: item.focus?.length > 0 ? item.focus : [''],
    });

    setSupportImageFile(null);
    setSupportImagePreview(getImageUrl(item.icon));

    supportModal.onOpen();
  };

  const handleWhySave = () => {
    if (!home?.id) {
      addToast({
        title: 'Gagal',
        description: 'Homepage belum tersedia.',
        color: 'danger',
      });
      return;
    }

    if (!whyForm.title.trim()) {
      addToast({
        title: 'Validasi',
        description: 'Title wajib diisi.',
        color: 'warning',
      });
      return;
    }

    if (editingWhy) {
      updateWhyMutation.mutate();
    } else {
      createWhyMutation.mutate();
    }
  };

  const handleSupportSave = () => {
    if (!home?.id) {
      addToast({
        title: 'Gagal',
        description: 'Homepage belum tersedia.',
        color: 'danger',
      });
      return;
    }

    const order = Number(supportWorkForm.order);

    if (!Number.isInteger(order) || order < 1) {
      addToast({
        title: 'Validasi',
        description: 'Order harus berupa angka bulat minimal 1.',
        color: 'warning',
      });
      return;
    }

    if (!supportWorkForm.title.trim()) {
      addToast({
        title: 'Validasi',
        description: 'Title wajib diisi.',
        color: 'warning',
      });
      return;
    }

    if (!supportWorkForm.description.trim()) {
      addToast({
        title: 'Validasi',
        description: 'Description wajib diisi.',
        color: 'warning',
      });
      return;
    }

    if (editingSupport) {
      updateSupportMutation.mutate();
    } else {
      createSupportMutation.mutate();
    }
  };

  const handleDelete = () => {
    if (!deletingItem) return;

    if (deletingItem.type === 'why') {
      deleteWhyMutation.mutate();
      return;
    }

    deleteSupportMutation.mutate();
  };

  const isSavingWhy =
    createWhyMutation.isPending || updateWhyMutation.isPending;

  const isSavingSupport =
    createSupportMutation.isPending || updateSupportMutation.isPending;

  const isDeleting =
    deleteWhyMutation.isPending || deleteSupportMutation.isPending;

  const addFocus = () => {
    setSupportWorkForm((prev) => ({
      ...prev,
      focus: [...prev.focus, ''],
    }));
  };

  const updateFocus = (index: number, value: string) => {
    setSupportWorkForm((prev) => ({
      ...prev,
      focus: prev.focus.map((item, itemIndex) =>
        itemIndex === index ? value : item
      ),
    }));
  };

  const removeFocus = (index: number) => {
    setSupportWorkForm((prev) => {
      const next = prev.focus.filter((_, itemIndex) => itemIndex !== index);

      return {
        ...prev,
        focus: next.length > 0 ? next : [''],
      };
    });
  };

  if (activeTab !== 'homepage') {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* MAIN HOMEPAGE CONTENT */}
      {isLoading ? (
        <Card shadow="none" className="border border-slate-200">
          <CardBody className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {Array.from({
                  length: 5,
                }).map((_, index) => (
                  <Skeleton key={index} className="rounded-lg">
                    <div className="h-10 rounded-lg bg-default-300" />
                  </Skeleton>
                ))}
              </div>

              <div className="space-y-4">
                <Skeleton className="rounded-xl">
                  <div className="h-64 rounded-xl bg-default-300" />
                </Skeleton>

                <Skeleton className="rounded-xl">
                  <div className="h-40 rounded-xl bg-default-300" />
                </Skeleton>
              </div>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card shadow="none" className="border border-slate-200">
          <CardBody className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Target size={20} className="text-blue-600" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Homepage Content
                </h2>

                <p className="text-sm text-slate-500">
                  Kelola seluruh konten utama halaman Homepage.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* LEFT */}
              <div className="space-y-5">
                <Input
                  label="Hero Tagline"
                  placeholder="Contoh: Bersama Kita Mendukung"
                  value={homeForm.heroTagline}
                  onValueChange={(value) =>
                    setHomeForm((prev) => ({
                      ...prev,
                      heroTagline: value,
                    }))
                  }
                />

                <Input
                  label="Hero Title"
                  placeholder="Judul utama Homepage"
                  value={homeForm.heroTitle}
                  onValueChange={(value) =>
                    setHomeForm((prev) => ({
                      ...prev,
                      heroTitle: value,
                    }))
                  }
                />

                <Textarea
                  label="Hero Description"
                  minRows={5}
                  placeholder="Deskripsi hero..."
                  value={homeForm.heroDescription}
                  onValueChange={(value) =>
                    setHomeForm((prev) => ({
                      ...prev,
                      heroDescription: value,
                    }))
                  }
                />

                <Textarea
                  label="Why Section Description"
                  minRows={4}
                  placeholder="Deskripsi bagian Why..."
                  value={homeForm.whyHomeDescription}
                  onValueChange={(value) =>
                    setHomeForm((prev) => ({
                      ...prev,
                      whyHomeDescription: value,
                    }))
                  }
                />

                <Textarea
                  label="Support Work Description"
                  minRows={4}
                  placeholder="Deskripsi bagian Support Work..."
                  value={homeForm.supportWorkDescription}
                  onValueChange={(value) =>
                    setHomeForm((prev) => ({
                      ...prev,
                      supportWorkDescription: value,
                    }))
                  }
                />
              </div>

              {/* RIGHT */}
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
                          alt="Hero"
                          className="w-full h-full object-cover"
                        />

                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Button
                            color="primary"
                            startContent={<Upload size={16} />}
                            onPress={() => heroInputRef.current?.click()}
                          >
                            Ganti Gambar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="w-full aspect-video flex flex-col items-center justify-center hover:bg-slate-100"
                        onClick={() => heroInputRef.current?.click()}
                      >
                        <ImageIcon size={35} className="text-slate-300" />

                        <span className="text-sm font-medium text-slate-600 mt-3">
                          Upload Hero Image
                        </span>

                        <span className="text-xs text-slate-400 mt-1">
                          JPG, PNG, WebP · Maks. 2 MB
                        </span>
                      </button>
                    )}

                    <input
                      ref={heroInputRef}
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

                <Input
                  label="Support Work Tagline"
                  placeholder="Tagline Support Work"
                  value={homeForm.supportWorkTagline}
                  onValueChange={(value) =>
                    setHomeForm((prev) => ({
                      ...prev,
                      supportWorkTagline: value,
                    }))
                  }
                />

                <Divider />

                <div>
                  <h3 className="font-semibold text-slate-800 mb-4">
                    CTA Section
                  </h3>

                  <div className="space-y-4">
                    <Input
                      label="CTA Tagline"
                      value={homeForm.ctaSectionTagline}
                      onValueChange={(value) =>
                        setHomeForm((prev) => ({
                          ...prev,
                          ctaSectionTagline: value,
                        }))
                      }
                    />

                    <Input
                      label="CTA Title"
                      value={homeForm.ctaSectionTitle}
                      onValueChange={(value) =>
                        setHomeForm((prev) => ({
                          ...prev,
                          ctaSectionTitle: value,
                        }))
                      }
                    />

                    <Textarea
                      label="CTA Subtitle"
                      minRows={3}
                      value={homeForm.ctaSectionSubtitle}
                      onValueChange={(value) =>
                        setHomeForm((prev) => ({
                          ...prev,
                          ctaSectionSubtitle: value,
                        }))
                      }
                    />

                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        CTA Background Image
                      </label>

                      <div className="relative overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50">
                        {ctaImagePreview ? (
                          <div className="relative aspect-video">
                            <img
                              src={ctaImagePreview}
                              alt="CTA"
                              className="w-full h-full object-cover"
                            />

                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <Button
                                color="primary"
                                startContent={<Upload size={16} />}
                                onPress={() => ctaInputRef.current?.click()}
                              >
                                Ganti Gambar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="w-full aspect-video flex flex-col items-center justify-center hover:bg-slate-100"
                            onClick={() => ctaInputRef.current?.click()}
                          >
                            <ImageIcon size={30} className="text-slate-300" />

                            <span className="text-sm font-medium text-slate-600 mt-2">
                              Upload CTA Image
                            </span>
                          </button>
                        )}

                        <input
                          ref={ctaInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={(event) => {
                            handleCtaImageChange(event.target.files?.[0]);

                            event.currentTarget.value = '';
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Divider className="my-6" />

            <div className="flex justify-end">
              <Button
                color="primary"
                isLoading={updateHomeMutation.isPending}
                onPress={() => updateHomeMutation.mutate()}
              >
                Simpan Homepage
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* WHY SECTION */}
      <Card shadow="none" className="border border-slate-200">
        <CardBody className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Lightbulb size={20} className="text-amber-600" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Why Section
                </h2>

                <p className="text-sm text-slate-500">
                  Kelola alasan mengapa pengguna mendukung campaign.
                </p>
              </div>
            </div>

            <Button
              color="primary"
              startContent={<Plus size={17} />}
              onPress={openCreateWhy}
              isDisabled={!home}
            >
              Tambah Why
            </Button>
          </div>

          <Input
            isClearable
            placeholder="Cari title atau subtitle..."
            startContent={<Search size={18} className="text-slate-400" />}
            value={whySearch}
            onValueChange={(value) => {
              setWhySearch(value);
              setWhyPage(1);
            }}
            onClear={() => {
              setWhySearch('');
              setWhyPage(1);
            }}
            className="mb-5"
          />

          {isLoading ? (
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
                      <div className="h-40 rounded-xl bg-default-300" />
                    </Skeleton>

                    <Skeleton className="rounded-lg mt-4">
                      <div className="h-5 rounded-lg bg-default-300" />
                    </Skeleton>

                    <Skeleton className="rounded-lg mt-2">
                      <div className="h-4 rounded-lg bg-default-300" />
                    </Skeleton>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : paginatedWhy.length === 0 ? (
            <div className="py-14 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Lightbulb size={28} className="text-slate-400" />
              </div>

              <h3 className="font-semibold text-slate-800 mt-4">
                {whySearch ? 'Data tidak ditemukan' : 'Belum ada Why Section'}
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                {whySearch
                  ? 'Coba gunakan kata kunci lain.'
                  : 'Tambahkan alasan untuk mendukung campaign.'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {paginatedWhy.map((item) => (
                  <Card
                    key={item.id}
                    shadow="none"
                    className="border border-slate-200 overflow-hidden group"
                  >
                    <CardBody className="p-0">
                      <div className="relative aspect-video bg-slate-100">
                        {item.icon ? (
                          <img
                            src={item.icon}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Lightbulb size={40} className="text-slate-300" />
                          </div>
                        )}

                        <div className="absolute top-3 right-3 flex gap-2">
                          <Button
                            isIconOnly
                            size="sm"
                            className="bg-white shadow"
                            onPress={() => openEditWhy(item)}
                          >
                            <Edit size={15} />
                          </Button>

                          <Button
                            isIconOnly
                            size="sm"
                            color="danger"
                            className="bg-white shadow"
                            onPress={() => {
                              setDeletingItem({
                                type: 'why',
                                id: item.id,
                                name: item.title,
                              });

                              deleteModal.onOpen();
                            }}
                          >
                            <Trash2 size={15} />
                          </Button>
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold text-slate-900">
                          {item.title}
                        </h3>

                        <p className="text-sm text-slate-500 mt-1 line-clamp-3">
                          {item.subTitle || 'Tidak ada subtitle.'}
                        </p>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>

              {whyTotalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    total={whyTotalPages}
                    page={whyPage}
                    onChange={setWhyPage}
                    showControls
                  />
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>

      {/* SUPPORT WORK */}
      <Card shadow="none" className="border border-slate-200">
        <CardBody className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Users size={20} className="text-emerald-600" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Support Work
                </h2>

                <p className="text-sm text-slate-500">
                  Kelola pekerjaan yang akan didukung oleh donatur.
                </p>
              </div>
            </div>

            <Button
              color="primary"
              startContent={<Plus size={17} />}
              onPress={openCreateSupport}
              isDisabled={!home}
            >
              Tambah Support Work
            </Button>
          </div>

          <Input
            isClearable
            placeholder="Cari support work..."
            startContent={<Search size={18} className="text-slate-400" />}
            value={supportSearch}
            onValueChange={(value) => {
              setSupportSearch(value);
              setSupportPage(1);
            }}
            onClear={() => {
              setSupportSearch('');
              setSupportPage(1);
            }}
            className="mb-5"
          />

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
                      <div className="h-12 rounded-lg bg-default-300" />
                    </Skeleton>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : paginatedSupport.length === 0 ? (
            <div className="py-14 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Users size={28} className="text-slate-400" />
              </div>

              <h3 className="font-semibold text-slate-800 mt-4">
                {supportSearch
                  ? 'Data tidak ditemukan'
                  : 'Belum ada Support Work'}
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                {supportSearch
                  ? 'Coba gunakan kata kunci lain.'
                  : 'Tambahkan pekerjaan yang akan ditampilkan pada Homepage.'}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {paginatedSupport.map((item) => (
                  <Card
                    key={item.id}
                    shadow="none"
                    className="border border-slate-200"
                  >
                    <CardBody className="p-5">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                          {item.icon ? (
                            <img
                              src={item.icon}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon size={28} className="text-slate-300" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <Chip size="sm" color="primary" variant="flat">
                              #{item.order}
                            </Chip>

                            {item.tagline && (
                              <Chip size="sm" variant="flat">
                                {item.tagline}
                              </Chip>
                            )}
                          </div>

                          <h3 className="font-bold text-slate-900 mt-2">
                            {item.title}
                          </h3>

                          <p className="text-sm text-slate-600 mt-1 line-clamp-3">
                            {item.description || 'Tidak ada deskripsi.'}
                          </p>

                          {item.focus?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {item.focus.map((focus, index) => (
                                <Chip
                                  key={`${item.id}-focus-${index}`}
                                  size="sm"
                                  variant="bordered"
                                >
                                  {focus}
                                </Chip>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex md:flex-col gap-2 shrink-0">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            onPress={() => openEditSupport(item)}
                          >
                            <Edit size={16} />
                          </Button>

                          <Button
                            isIconOnly
                            size="sm"
                            color="danger"
                            variant="flat"
                            onPress={() => {
                              setDeletingItem({
                                type: 'support',
                                id: item.id,
                                name: item.title,
                              });

                              deleteModal.onOpen();
                            }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>

              {supportTotalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    total={supportTotalPages}
                    page={supportPage}
                    onChange={setSupportPage}
                    showControls
                  />
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>

      {/* WHY MODAL */}
      <Modal
        isOpen={whyModal.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            resetWhyForm();
          }

          whyModal.onOpenChange();
        }}
        size="2xl"
      >
        <ModalContent>
          <ModalHeader>
            {editingWhy ? 'Edit Why Section' : 'Tambah Why Section'}
          </ModalHeader>

          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Image
                </label>

                <div className="relative overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50">
                  {whyImagePreview ? (
                    <div className="relative aspect-square">
                      <img
                        src={whyImagePreview}
                        alt="Why"
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                        <Button
                          className="w-full"
                          size="sm"
                          color="primary"
                          startContent={<Upload size={15} />}
                          onPress={() => whyImageInputRef.current?.click()}
                        >
                          Ganti Gambar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="w-full aspect-square flex flex-col items-center justify-center hover:bg-slate-100"
                      onClick={() => whyImageInputRef.current?.click()}
                    >
                      <ImageIcon size={32} className="text-slate-300" />

                      <span className="text-sm font-medium text-slate-600 mt-3">
                        Upload Image
                      </span>
                    </button>
                  )}

                  <input
                    ref={whyImageInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(event) => {
                      handleWhyImageChange(event.target.files?.[0]);

                      event.currentTarget.value = '';
                    }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  label="Title"
                  isRequired
                  placeholder="Contoh: Transparan"
                  value={whyForm.title}
                  onValueChange={(value) =>
                    setWhyForm((prev) => ({
                      ...prev,
                      title: value,
                    }))
                  }
                />

                <Textarea
                  label="Subtitle"
                  placeholder="Penjelasan singkat..."
                  minRows={5}
                  value={whyForm.subTitle}
                  onValueChange={(value) =>
                    setWhyForm((prev) => ({
                      ...prev,
                      subTitle: value,
                    }))
                  }
                />
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="flat"
              onPress={() => {
                resetWhyForm();
                whyModal.onClose();
              }}
              isDisabled={isSavingWhy}
            >
              Batal
            </Button>

            <Button
              color="primary"
              isLoading={isSavingWhy}
              onPress={handleWhySave}
            >
              {editingWhy ? 'Simpan Perubahan' : 'Tambah Why'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* SUPPORT WORK MODAL */}
      <Modal
        isOpen={supportModal.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            resetSupportForm();
          }

          supportModal.onOpenChange();
        }}
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>
            {editingSupport ? 'Edit Support Work' : 'Tambah Support Work'}
          </ModalHeader>

          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Image
                </label>

                <div className="relative overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50">
                  {supportImagePreview ? (
                    <div className="relative aspect-square">
                      <img
                        src={supportImagePreview}
                        alt="Support"
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                        <Button
                          className="w-full"
                          size="sm"
                          color="primary"
                          startContent={<Upload size={15} />}
                          onPress={() => supportImageInputRef.current?.click()}
                        >
                          Ganti Gambar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="w-full aspect-square flex flex-col items-center justify-center hover:bg-slate-100"
                      onClick={() => supportImageInputRef.current?.click()}
                    >
                      <ImageIcon size={32} className="text-slate-300" />

                      <span className="text-sm font-medium text-slate-600 mt-3">
                        Upload Image
                      </span>
                    </button>
                  )}

                  <input
                    ref={supportImageInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(event) => {
                      handleSupportImageChange(event.target.files?.[0]);

                      event.currentTarget.value = '';
                    }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  label="Order"
                  isRequired
                  type="number"
                  min={1}
                  placeholder="1"
                  value={supportWorkForm.order}
                  onValueChange={(value) =>
                    setSupportWorkForm((prev) => ({
                      ...prev,
                      order: value,
                    }))
                  }
                />

                <Input
                  label="Title"
                  isRequired
                  placeholder="Judul Support Work"
                  value={supportWorkForm.title}
                  onValueChange={(value) =>
                    setSupportWorkForm((prev) => ({
                      ...prev,
                      title: value,
                    }))
                  }
                />

                <Input
                  label="Tagline"
                  placeholder="Tagline"
                  value={supportWorkForm.tagline}
                  onValueChange={(value) =>
                    setSupportWorkForm((prev) => ({
                      ...prev,
                      tagline: value,
                    }))
                  }
                />

                <Textarea
                  label="Description"
                  isRequired
                  minRows={5}
                  placeholder="Deskripsi pekerjaan..."
                  value={supportWorkForm.description}
                  onValueChange={(value) =>
                    setSupportWorkForm((prev) => ({
                      ...prev,
                      description: value,
                    }))
                  }
                />
              </div>
            </div>

            <Divider className="my-2" />

            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-800">Focus</h3>

                  <p className="text-xs text-slate-500">
                    Tambahkan fokus pekerjaan untuk Support Work ini.
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="flat"
                  color="primary"
                  startContent={<Plus size={15} />}
                  onPress={addFocus}
                >
                  Tambah Focus
                </Button>
              </div>

              <div className="space-y-2">
                {supportWorkForm.focus.map((focus, index) => (
                  <div key={`focus-${index}`} className="flex gap-2">
                    <Input
                      placeholder={`Focus ${index + 1}`}
                      value={focus}
                      onValueChange={(value) => updateFocus(index, value)}
                      className="flex-1"
                    />

                    <Button
                      isIconOnly
                      color="danger"
                      variant="light"
                      onPress={() => removeFocus(index)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="flat"
              onPress={() => {
                resetSupportForm();
                supportModal.onClose();
              }}
              isDisabled={isSavingSupport}
            >
              Batal
            </Button>

            <Button
              color="primary"
              isLoading={isSavingSupport}
              onPress={handleSupportSave}
            >
              {editingSupport ? 'Simpan Perubahan' : 'Tambah Support Work'}
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
            <div className="text-center py-2">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
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
