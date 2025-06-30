"use client";

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Toaster } from 'sonner';
import { useSession } from 'next-auth/react';

interface SalesLayoutProps {
  children: ReactNode;
}

// Layout utama untuk semua halaman sales
export default function SalesLayout({ children }: SalesLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated' && pathname && !pathname.includes('/login')) {
      const redirectUrl = `/sales/login?callbackUrl=${encodeURIComponent(pathname)}`;
      window.location.href = redirectUrl;
    }
  }, [status, pathname, router]);

  // Tampilkan loading state jika status masih loading
  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p>Checking session...</p>
      </div>
    );
  }

  // If unauthenticated, show a message while redirecting (should be very brief)
  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        {children}
      </main>
      <Toaster position="top-right" />
    </div>
  );
}
