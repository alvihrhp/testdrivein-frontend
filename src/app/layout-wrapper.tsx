"use client";

import { usePathname } from 'next/navigation';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Komponen untuk layout utama (dengan Header)
function MainLayout({ children }: { children: React.ReactNode }) {
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

// Komponen untuk layout sales (tanpa Header)
function SalesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
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
