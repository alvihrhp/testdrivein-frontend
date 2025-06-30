'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface TemplateProps {
  children: React.ReactNode;
}

export default function Template({ children }: TemplateProps) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    handleStart();
    // Simulasikan loading minimal 300ms agar tidak berkedip terlalu cepat
    const timer = setTimeout(() => {
      handleComplete();
    }, 300);

    return () => {
      clearTimeout(timer);
      handleComplete();
    };
  }, [pathname]);

  return (
    <>
      {loading ? (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : null}
      {children}
    </>
  );
}
