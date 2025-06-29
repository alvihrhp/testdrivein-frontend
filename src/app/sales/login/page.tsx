"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Mail, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Jika sudah login, redirect ke dashboard
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const isLoggedIn = localStorage.getItem('isAuthenticated') === 'true';
    if (isLoggedIn) {
      const callbackUrl = searchParams.get('callbackUrl') || '/sales/dashboard';
      window.location.href = callbackUrl;
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validasi form
    const validationErrors: Record<string, string> = {};
    if (!formData.email) validationErrors.email = 'Email harus diisi';
    if (!formData.password) validationErrors.password = 'Password harus diisi';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Simulasi loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simpan status login di cookie
      document.cookie = 'isAuthenticated=true; path=/; max-age=86400'; // 1 hari
      
      // Redirect ke dashboard
      const callbackUrl = searchParams.get('callbackUrl') || '/sales/dashboard';
      window.location.href = callbackUrl;
      
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login Gagal',
        description: error instanceof Error ? error.message : 'Terjadi kesalahan saat login',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 text-black">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-gray-200">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-black">Login Sales</CardTitle>
                <CardDescription className="text-gray-800">
                  Masuk ke akun Anda untuk melanjutkan
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild className="border border-gray-200 hover:bg-gray-100">
                <Link href="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@contoh.com"
                  leftIcon={<Mail className="h-4 w-4 text-gray-500" />}
                  className={errors.email ? 'border-red-500' : ''}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-black"
                  >
                    Password
                  </label>
                  <Link
                    href="/lupa-password"
                    className="text-sm text-gray-700 hover:text-black underline-offset-4 hover:underline"
                  >
                    Lupa password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  leftIcon={<Lock className="h-4 w-4 text-gray-500" />}
                  className={errors.password ? 'border-red-500' : ''}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Masuk'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-gray-600">
              Belum punya akun?{' '}
              <Link
                href="/daftar"
                className="font-medium text-primary hover:underline"
              >
                Daftar sekarang
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
