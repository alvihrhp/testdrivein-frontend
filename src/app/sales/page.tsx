'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SalesPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/sales/dashboard';

  useEffect(() => {
    // Pastikan kode ini hanya berjalan di client side
    if (typeof window === 'undefined') return;
    
    // Cek status login dari cookie
    const isLoggedIn = document.cookie.split('; ').some(cookie => cookie.startsWith('isAuthenticated='));
    
    if (isLoggedIn) {
      window.location.href = callbackUrl;
    } else {
      const loginUrl = new URL('/sales/login', window.location.origin);
      loginUrl.searchParams.set('callbackUrl', callbackUrl);
      window.location.href = loginUrl.toString();
    }
  }, [callbackUrl]);

  // Tampilkan loading sambil redirect
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}
