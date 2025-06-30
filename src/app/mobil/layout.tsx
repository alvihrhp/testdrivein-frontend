import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface CarDetailLayoutProps {
  children: React.ReactNode;
}

export default function CarDetailLayout({ children }: CarDetailLayoutProps) {
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
