'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { X, Mail, Lock, User, Phone, Check, X as XIcon, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { signIn } from 'next-auth/react';
import { useToast } from "@/components/ui/use-toast";
import { cn } from '@/lib/utils';

type AuthMode = 'login' | 'register';

interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onLoginSuccess?: () => void;
  initialMode?: AuthMode;
  trigger?: React.ReactNode;
}

export function AuthModal({ 
  isOpen: isOpenProp, 
  onClose: onCloseProp, 
  onLoginSuccess, 
  initialMode = 'login',
  trigger 
}: AuthModalProps) {
  const [isOpenState, setIsOpenState] = useState(false);
  const isControlled = isOpenProp !== undefined;
  const isOpen = isControlled ? isOpenProp : isOpenState;
  
  const onClose = () => {
    if (!isControlled) {
      setIsOpenState(false);
    }
    onCloseProp?.();
  };
  
  const onOpen = () => {
    if (!isControlled) {
      setIsOpenState(true);
    }
  };
  const { toast } = useToast();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  
  // Password validation rules
  const validatePassword = (pass: string) => {
    const errors: string[] = [];
    if (pass.length < 9) errors.push('Minimal 9 karakter');
    if (!/[A-Z]/.test(pass)) errors.push('Minimal 1 huruf kapital');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) errors.push('Minimal 1 karakter spesial');
    return errors;
  };
  
  // Check if passwords match
  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  
  // Update password errors when password changes
  useEffect(() => {
    if (mode === 'register' && password) {
      setPasswordErrors(validatePassword(password));
    }
  }, [password, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (mode === 'register') {
      // Validate registration form
      if (!name || !email || !phone || !password || !confirmPassword) {
        setError('Semua field harus diisi');
        return;
      }
      
      if (password !== confirmPassword) {
        setError('Konfirmasi password tidak cocok');
        return;
      }
      
      const errors = validatePassword(password);
      if (errors.length > 0) {
        setError('Password tidak memenuhi persyaratan');
        return;
      }
      
      // Handle registration using signIn with isRegister flag
      try {
        setIsLoading(true);
        
        const result = await signIn('credentials', {
          name,
          email,
          phone,
          password,
          isRegister: true,
          redirect: false,
        });
        
        if (result?.error) {
          throw new Error(result.error || 'Registrasi gagal');
        }
        
        onClose();
        if (onLoginSuccess) onLoginSuccess();
        
        toast({
          title: 'Registrasi Berhasil',
          description: 'Akun Anda berhasil dibuat dan Anda sudah masuk.',
        });
        
      } catch (err) {
        console.error('Registration error:', err);
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat registrasi');
      } finally {
        setIsLoading(false);
      }
      
    } else {
      // Handle login
      try {
        setIsLoading(true);
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          throw new Error('Email atau password salah');
        }

        onClose();
        if (onLoginSuccess) onLoginSuccess();

        toast({
          title: 'Login Berhasil',
          description: 'Anda berhasil masuk ke akun Anda.',
        });
      } catch (err) {
        console.error('Login error:', err);
        setError('Email atau password salah');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await signIn('google', { 
        callbackUrl: window.location.pathname,
        redirect: false 
      });
      
      onClose();
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      console.error('Google login error:', err);
      setError('Gagal login dengan Google');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
  };

  const content = (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {mode === 'login' ? 'Masuk ke Akun Anda' : 'Buat Akun Baru'}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {mode === 'login' 
              ? 'Masukkan email dan password Anda untuk melanjutkan.'
              : 'Buat akun baru untuk memulai.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md">
              {error}
            </div>
          )}
          
          {mode === 'register' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <User className="h-5 w-5 text-black" />
                </div>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 w-full relative z-0"
                  placeholder="Nama lengkap"
                  required={mode === 'register'}
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Mail className="h-5 w-5 text-black" />
              </div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 w-full relative z-0"
                placeholder="Email"
                required
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Nomor Telepon
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Phone className="h-5 w-5 text-black" />
                </div>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9+]/g, ''))}
                  className="pl-10 w-full relative z-0"
                  placeholder="Contoh: 081234567890"
                  required={mode === 'register'}
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              {mode === 'login' ? 'Password' : 'Buat Password'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Lock className="h-5 w-5 text-black" />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full pr-10 relative z-0"
                placeholder={mode === 'login' ? 'Password' : 'Buat password'}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-900" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-900" />
                )}
              </button>
            </div>
            
            {mode === 'register' && password && (
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-500">Password harus memenuhi:</p>
                <ul className="text-xs space-y-1">
                  <PasswordRequirement 
                    met={password.length >= 9} 
                    text="Minimal 9 karakter" 
                  />
                  <PasswordRequirement 
                    met={/[A-Z]/.test(password)} 
                    text="Minimal 1 huruf kapital" 
                  />
                  <PasswordRequirement 
                    met={/[!@#$%^&*(),.?\":{}|<>]/.test(password)} 
                    text="Minimal 1 karakter spesial" 
                  />
                </ul>
              </div>
            )}
          </div>
          
          {mode === 'register' && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Konfirmasi Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Lock className="h-5 w-5 text-black" />
                </div>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={cn(
                    "pl-10 w-full pr-10",
                    confirmPassword && password !== confirmPassword && "border-red-500"
                  )}
                  placeholder="Konfirmasi password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-900" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-900" />
                  )}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs text-red-600">Password tidak cocok</p>
              )}
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading || (mode === 'register' && (passwordErrors.length > 0 || !passwordsMatch))}
            >
              {isLoading ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Daftar'}
            </Button>
          </div>

          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Atau lanjutkan dengan</span>
            </div>
          </div>
          <div className="mt-6">
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <GoogleIcon />
              Masuk dengan Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            {mode === 'login' ? (
              <>
                Belum punya akun?{' '}
                <button 
                  type="button" 
                  onClick={toggleMode}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Daftar sekarang
                </button>
              </>
            ) : (
              <>
                Sudah punya akun?{' '}
                <button 
                  type="button" 
                  onClick={toggleMode}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Masuk di sini
                </button>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  if (trigger) {
    return (
      <>
        <div onClick={onOpen}>
          {trigger}
        </div>
        {content}
      </>
    );
  }

  return content;
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
      <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.28426 53.749 C -8.52426 55.229 -9.42426 56.479 -10.7843 57.329 L -10.7843 60.609 L -6.82426 60.609 C -4.56426 58.499 -3.264 55.239 -3.264 51.509 Z" />
        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.80426 62.159 -6.82426 60.609 L -10.7843 57.329 C -11.7643 58.049 -13.074 58.489 -14.754 58.489 C -17.444 58.489 -19.654 56.599 -20.474 54.119 L -24.5443 54.119 L -24.5443 57.589 C -22.5843 61.559 -18.924 63.239 -14.754 63.239 Z" />
        <path fill="#FBBC05" d="M -20.474 54.119 C -20.734 53.279 -20.874 52.389 -20.874 51.479 C -20.874 50.569 -20.724 49.679 -20.474 48.849 L -20.474 45.379 L -24.5443 45.379 C -25.5543 47.419 -26.0843 49.699 -26.0843 51.989 C -26.0843 54.279 -25.5543 56.549 -24.5443 58.589 L -20.474 54.119 Z" />
        <path fill="#EA4335" d="M -14.754 44.469 C -12.984 44.469 -11.404 45.029 -10.054 46.109 L -6.73426 42.839 C -8.86426 40.919 -11.614 39.739 -14.754 39.739 C -18.924 39.739 -22.5843 41.429 -24.5443 45.379 L -20.474 48.849 C -19.654 46.369 -17.444 44.469 -14.754 44.469 Z" />
      </g>
    </svg>
  );
}

interface PasswordRequirementProps {
  met: boolean;
  text: string;
}

function PasswordRequirement({ met, text }: PasswordRequirementProps) {
  return (
    <li className="flex items-center">
      {met ? (
        <Check className="h-4 w-4 text-green-500 mr-2" />
      ) : (
        <XIcon className="h-4 w-4 text-red-500 mr-2" />
      )}
      <span className={met ? 'text-green-600' : 'text-gray-500'}>{text}</span>
    </li>
  );
}
