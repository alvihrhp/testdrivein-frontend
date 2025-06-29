"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Cek status login saat komponen dimuat
    const checkAuth = async () => {
      try {
        // Di sini Anda bisa menambahkan validasi token dengan backend
        const token = localStorage.getItem('auth_token');
        
        if (token) {
          // Contoh: Ambil data user dari token atau API
          // const response = await fetch('/api/auth/me', {
          //   headers: { 'Authorization': `Bearer ${token}` }
          // });
          // const userData = await response.json();
          // setUser(userData);
          
          // Untuk sementara, kita set user dummy
          setUser({
            id: '1',
            name: 'Sales 1',
            email: 'sales@testdrivein.com',
            role: 'sales'
          });
        }
      } catch (error) {
        console.error('Gagal memeriksa autentikasi:', error);
        localStorage.removeItem('auth_token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // @ts-ignore - password is intentionally unused in mock implementation
    try {
      // Ganti dengan panggilan API sebenarnya
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      // const data = await response.json();
      
      // Simulasi respons API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: '1',
        name: 'Sales 1',
        email: email,
        role: 'sales'
      };
      
      const mockToken = 'mock-jwt-token';
      
      // Simpan token di localStorage dan state
      localStorage.setItem('auth_token', mockToken);
      setUser(mockUser);
      
      toast({
        title: 'Login berhasil',
        description: 'Anda akan diarahkan ke dashboard',
      });
      
      router.push('/sales/dashboard');
    } catch (error) {
      console.error('Login gagal:', error);
      toast({
        title: 'Login gagal',
        description: 'Email atau password salah',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const logout = () => {
    // Hapus token dan reset state
    localStorage.removeItem('auth_token');
    setUser(null);
    
    toast({
      title: 'Logout berhasil',
      description: 'Anda telah keluar dari sistem',
    });
    
    router.push('/sales/login');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        logout, 
        isAuthenticated: !!user 
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
