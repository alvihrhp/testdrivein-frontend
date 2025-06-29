"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole = 'sales',
  redirectTo = '/sales/login'
}: ProtectedRouteProps) {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Redirect ke halaman login dengan menyimpan URL asal
      router.push(`${redirectTo}?from=${encodeURIComponent(window.location.pathname)}`);
    } else if (!loading && isAuthenticated && user?.role !== requiredRole) {
      // Redirect ke halaman tidak diizinkan jika role tidak sesuai
      router.push('/unauthorized');
    }
  }, [isAuthenticated, loading, router, requiredRole, user, redirectTo]);

  if (loading || !isAuthenticated || (user && user.role !== requiredRole)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Memeriksa autentikasi...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
