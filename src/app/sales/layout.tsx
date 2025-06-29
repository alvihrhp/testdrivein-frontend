"use client";

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Toaster } from 'sonner';
import { useSession } from 'next-auth/react';

// Layout utama untuk semua halaman sales
export default function SalesLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status, update } = useSession();

  // Debugging
  useEffect(() => {
    console.log('Session status:', status);
    console.log('Session data:', session);
    console.log('Current pathname:', pathname);
    
    if (status === 'unauthenticated' && !pathname.includes('/login')) {
      console.log('Redirecting to login...');
      const redirectUrl = `/sales/login?callbackUrl=${encodeURIComponent(pathname)}`;
      console.log('Attempting to navigate to:', redirectUrl);
      
      // Force a full page reload to ensure clean navigation
      window.location.href = redirectUrl;
      
      // Fallback in case window.location doesn't work
      setTimeout(() => {
        if (window.location.pathname !== '/sales/login') {
          console.log('Fallback navigation to login');
          router.push(redirectUrl);
        }
      }, 1000);
    }
  }, [status, session, pathname, router]);

  // Tampilkan loading state jika status masih loading
  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p>Memeriksa sesi...</p>
      </div>
    );
  }

  // If unauthenticated, show a message while redirecting (should be very brief)
  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Mengarahkan ke halaman login...</p>
      </div>
    );
  }

  console.log('User authenticated:', session?.user);

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        {children}
      </main>
      <Toaster position="top-right" />
    </div>
  );
}
