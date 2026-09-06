import { useState, type FormEvent } from 'react';
import { Button, Card, CardBody, Input, addToast } from '@heroui/react';
import {
  ArrowRight,
  Eye,
  EyeOff,
  HeartHandshake,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from 'lucide-react';

import { useAuthStore } from '@/stores/auth';
import { useAuthSignIn } from '@/services/auth';
import { useNavigate } from 'react-router-dom';
import type { BaseResponse } from '@/interfaces/base.interface';
import { SEO } from '@/components/SEO';
import { isValidationErrorArray } from '@/utils/errorValidation';

type LoginPayload = {
  email: string;
  password: string;
};

type FormErrors = {
  email?: string;
  password?: string;
};

const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) {
    return 'Email wajib diisi.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return 'Format email tidak valid.';
  }

  return undefined;
};

const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return 'Password wajib diisi.';
  }

  if (password.length < 6) {
    return 'Password minimal 6 karakter.';
  }

  return undefined;
};

export default function Login() {
  const setAuth = useAuthStore((state) => state.setAuth);

  const [form, setForm] = useState<LoginPayload>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  /**
   * ============================================================
   * FIELD VALIDATION
   * ============================================================
   */
  const validateField = (
    field: keyof LoginPayload,
    value: string
  ): string | undefined => {
    if (field === 'email') {
      return validateEmail(value);
    }

    return validatePassword(value);
  };

  const handleChange = (field: keyof LoginPayload, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    /**
     * Kalau field sudah pernah disentuh,
     * error akan langsung diperbarui saat user mengetik.
     */
    if (touched[field]) {
      const error = validateField(field, value);

      setErrors((previous) => ({
        ...previous,
        [field]: error,
      }));
    }
  };

  const handleBlur = (field: keyof LoginPayload) => {
    setTouched((previous) => ({
      ...previous,
      [field]: true,
    }));

    const error = validateField(field, form[field]);

    setErrors((previous) => ({
      ...previous,
      [field]: error,
    }));
  };

  /**
   * ============================================================
   * FORM VALIDATION
   * ============================================================
   */
  const validateForm = (): boolean => {
    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);

    const newErrors: FormErrors = {
      email: emailError,
      password: passwordError,
    };

    setErrors(newErrors);

    setTouched({
      email: true,
      password: true,
    });

    return !emailError && !passwordError;
  };

  /**
   * ============================================================
   * SUBMIT
   * ============================================================
   */
  const navigate = useNavigate();
  const { mutateAsync } = useAuthSignIn();
  const [isLoading, setLoading] = useState(false);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    /**
     * Jangan submit kalau validation gagal.
     */
    if (!validateForm()) {
      addToast({
        title: 'Periksa kembali form',
        description: 'Pastikan email dan password sudah diisi dengan benar.',
        color: 'warning',
      });

      return;
    }
    setLoading(true);

    const payload: LoginPayload = {
      email: form.email.trim(),
      password: form.password,
    };

    await mutateAsync(payload, {
      onSuccess: (data) => {
        setAuth({
          user: data.data.user,
          token: {
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken,
          },
        });

        addToast({
          title: 'Login berhasil',
          description: 'Selamat datang kembali di Ayo Berdonasi.',
          color: 'success',
        });

        navigate('/admin');
      },

      onError: (error) => {
        setLoading(false);
        const response = error.response?.data as BaseResponse;

        if (isValidationErrorArray(response?.error)) {
          const fieldErrors: FormErrors = {};

          response.error.forEach((item) => {
            if (item.field === 'email') {
              fieldErrors.email = item.message;
            }

            if (item.field === 'password') {
              fieldErrors.password = item.message;
            }
          });

          setErrors(fieldErrors);

          setTouched({
            email: true,
            password: true,
          });

          return;
        }

        addToast({
          title: 'Login gagal',
          description:
            response?.message ?? 'Terjadi kesalahan saat mencoba masuk.',
          color: 'danger',
        });
      },
    });
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <SEO
        title="Sign In"
        description="Masuk ke halaman administrasi platform donasi untuk mengelola campaign, donasi, konten, media, dan informasi platform."
      />
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* ======================================================
            LEFT SIDE
        ======================================================= */}
        <section className="hidden lg:block">
          <div className="max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-atac-green-soft border border-atac-green-light text-atac-green-dark text-sm font-medium mb-6">
              <HeartHandshake size={16} />
              <span>Bersama Untuk Kebaikan</span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-bold tracking-tight text-foreground leading-tight">
              Selamat Datang di{' '}
              <span className="text-primary">Ayo Berdonasi</span>
            </h1>

            <p className="mt-5 text-slate-600 text-lg leading-relaxed max-w-md">
              Masuk ke akunmu untuk melihat aktivitas dukungan, riwayat donasi,
              dan berbagai program yang telah kamu dukung.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-atac-green-light text-atac-green-dark flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">
                    Data Terjaga
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Informasi akunmu dikelola dengan aman.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-atac-green-light text-atac-green-dark flex items-center justify-center">
                  <HeartHandshake size={20} />
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">
                    Dukung Lebih Banyak
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Kelola aktivitas dukunganmu dengan mudah.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================
            LOGIN CARD
        ======================================================= */}
        <section className="w-full">
          <Card
            shadow="sm"
            className="w-full max-w-md mx-auto border border-slate-200 bg-card"
          >
            <CardBody className="p-6 sm:p-8">
              {/* Logo / Brand */}
              <div className="flex justify-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-atac-green-soft border border-atac-green-light flex items-center justify-center">
                  <HeartHandshake size={28} className="text-atac-green-dark" />
                </div>
              </div>

              {/* Heading */}
              <div className="text-center mb-7">
                <h2 className="text-2xl font-bold text-foreground">
                  Masuk ke Akun
                </h2>

                <p className="text-sm text-slate-500 mt-2">
                  Masuk untuk melanjutkan aktivitasmu.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Email */}
                <Input
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="Masukkan email kamu"
                  value={form.email}
                  onValueChange={(value) => handleChange('email', value)}
                  onBlur={() => handleBlur('email')}
                  isInvalid={Boolean(touched.email && errors.email)}
                  errorMessage={touched.email ? errors.email : undefined}
                  startContent={<Mail size={18} className="text-slate-400" />}
                  variant="bordered"
                  radius="lg"
                  size="lg"
                  autoComplete="email"
                  isDisabled={isLoading}
                />

                {/* Password */}
                <Input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  placeholder="Masukkan password kamu"
                  value={form.password}
                  onValueChange={(value) => handleChange('password', value)}
                  onBlur={() => handleBlur('password')}
                  isInvalid={Boolean(touched.password && errors.password)}
                  errorMessage={touched.password ? errors.password : undefined}
                  startContent={
                    <LockKeyhole size={18} className="text-slate-400" />
                  }
                  endContent={
                    <button
                      type="button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      className="text-slate-400 hover:text-atac-green-dark transition-colors cursor-pointer outline-none"
                      aria-label={
                        showPassword
                          ? 'Sembunyikan password'
                          : 'Tampilkan password'
                      }
                    >
                      {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                  }
                  variant="bordered"
                  radius="lg"
                  size="lg"
                  autoComplete="current-password"
                  isDisabled={isLoading}
                />

                {/* Submit */}
                <Button
                  type="submit"
                  color="primary"
                  size="lg"
                  radius="lg"
                  fullWidth
                  isLoading={isLoading}
                  isDisabled={isLoading}
                  endContent={!isLoading ? <ArrowRight size={18} /> : undefined}
                  className="font-semibold"
                >
                  {isLoading ? 'Memproses...' : 'Masuk'}
                </Button>
              </form>

              {/* Footer */}
              <div className="mt-7 pt-5 border-t border-slate-100">
                <p className="text-xs text-center text-slate-400 leading-relaxed">
                  Dengan masuk, kamu menyetujui ketentuan penggunaan dan
                  kebijakan privasi kami.
                </p>
              </div>
            </CardBody>
          </Card>
        </section>
      </div>
    </main>
  );
}
