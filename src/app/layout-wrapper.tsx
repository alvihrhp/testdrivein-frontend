"use client";

import { usePathname } from 'next/navigation';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-64px)]">
        {children}
      </main>
      <Footer />
    </>
  );
}

interface SalesLayoutProps {
  children: React.ReactNode;
}

export function SalesLayout({ children }: SalesLayoutProps) {
  return (
    <main className="min-h-screen bg-gray-50">
      {children}
    </main>
  );
}

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  
  // Gunakan SalesLayout untuk route /sales
  if (pathname.startsWith('/sales')) {
    return <SalesLayout>{children}</SalesLayout>;
  }
  
  // Gunakan MainLayout untuk route lainnya
  return <MainLayout>{children}</MainLayout>;
}
