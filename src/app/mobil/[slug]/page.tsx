import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { getCarBySlug } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Share2, Heart, Calendar, MapPin, Phone, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { CarImageGallery } from '@/components/CarImageGallery';

interface Sales {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Car {
  id: string;
  name: string;
  brand: string;
  year: number;
  price: number;
  description: string;
  image: string;
  images?: string[];
  showroom?: string;
  engine_type?: string;
  engine_capacity?: number;
  jenis_mobil?: string;
  capacity?: number;
  slug: string;
  salesId: string;
  sales: Sales;
}

// Types for our page props
interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// This is a server component that renders a client component
function ImageGallery({ car, activeIndex }: { car: Car; activeIndex: number }) {
  return (
    <CarImageGallery 
      car={car} 
      activeIndex={activeIndex}
      totalImages={car.images?.length || 0}
    />
  );
}

// Main page component
export default async function CarDetailPage({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: PageProps) {
  // Await both params and searchParams
  const [params, searchParams] = await Promise.all([paramsPromise, searchParamsPromise]);
  
  // Now we can safely access the properties
  const car = await getCarBySlug(params.slug);
  
  const imageParam = searchParams?.image;
  const images = car.images || [car.image];
  const totalImages = images.length;
  
  // Ensure activeImageIndex is within bounds
  let activeImageIndex = 
    typeof imageParam === 'string' ? 
      Math.min(Number(imageParam), totalImages - 1) :
      Array.isArray(imageParam) ? 
        Math.min(Number(imageParam[0] || 0), totalImages - 1) :
        0;
  
  // Ensure activeImageIndex is not negative
  activeImageIndex = Math.max(0, activeImageIndex);
  
  // Calculate next and previous image indices with wrapping
  const nextImageIndex = (activeImageIndex + 1) % totalImages;
  const prevImageIndex = (activeImageIndex - 1 + totalImages) % totalImages;
  
  // Function to generate URL with updated image index
  const getImageUrl = (index: number) => {
    const params = new URLSearchParams();
    // Only keep the image parameter to avoid duplicate params
    params.set('image', index.toString());
    return `?${params.toString()}`;
  };
  
  if (!car) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center">
          <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center text-sm sm:text-base">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
            <span className="hidden sm:inline">Kembali</span>
          </Link>
          <h1 className="text-base sm:text-lg font-semibold text-gray-900 mx-auto sm:mx-0 sm:ml-6 truncate max-w-[180px] sm:max-w-none">
            {car.brand} {car.name}
          </h1>
          <div className="ml-auto flex space-x-2 sm:space-x-3">
            <button 
              className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-900"
              aria-label="Bagikan"
            >
              <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button 
              className="p-1.5 sm:p-2 text-gray-600 hover:text-red-500"
              aria-label="Simpan"
            >
              <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="w-full px-3 sm:px-4 lg:px-6 py-4 sm:py-6 max-w-7xl mx-auto">
        {/* Top Section - Image + Booking */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Car Image Gallery */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Thumbnail Carousel */}
            <div className="border-t border-gray-100 relative group">
              <div className="relative">
                <CarImageGallery 
                  car={car} 
                  activeIndex={activeImageIndex} 
                  totalImages={totalImages} 
                />
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4 text-black">Booking Test Drive</h2>
              <p className="text-black text-xs sm:text-sm mb-3 sm:mb-4">
                Jadwalkan test drive untuk merasakan pengalaman berkendara mobil ini secara langsung.
              </p>
              
              {/* Sales Info */}
              <div className="bg-blue-50 rounded-lg p-3 mb-4 flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">
                  {car.sales.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-black">Dilayani oleh {car.sales.name}</p>
                  <p className="text-xs text-gray-700">Sales Executive</p>
                </div>
              </div>
              
              <Link 
                href={{
                  pathname: `/mobil/${car.slug}/booking`,
                  query: {
                    carId: car.id,
                    carName: car.name,
                    salesId: car.salesId,
                    salesName: car.sales.name,
                    salesPhone: car.sales.phone
                  }
                }}
                className="block w-full"
              >
                <Button className="w-full py-3 text-base font-medium cursor-pointer">
                  <Calendar className="h-5 w-5 mr-2" />
                  Booking Sekarang
                </Button>
              </Link>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-medium mb-3 text-black">Lokasi Showroom</h3>
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.800061175196!2d107.61046531531887!3d-6.917142369381925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e62a24d33491%3A0x3039d80b220cc20!2sGedung%20Sate!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    className="w-full h-full"
                    title="Lokasi Showroom"
                  ></iframe>
                </div>
                <p className="mt-3 text-sm text-black">
                  Jl. Diponegoro No.22, Citarum, Kec. Bandung Wetan, Kota Bandung, Jawa Barat 40115
                </p>
                <a 
                  href="https://goo.gl/maps/example" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm mt-2"
                >
                  <span>Buka di Google Maps</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Car Details - Full Width */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Detail Mobil</h2>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{car.name}</h1>
              <p className="text-gray-600">{car.brand} • {car.year}</p>
            </div>
            <p className="text-2xl font-bold text-blue-600 mt-2 sm:mt-0">
              {formatCurrency(car.price)}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Tipe Mesin</p>
              <p className="font-medium text-gray-900">{car.engine_type || '-'}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Kapasitas Mesin</p>
              <p className="font-medium text-gray-900">{car.engine_capacity ? `${car.engine_capacity} cc` : '-'}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Jenis Mobil</p>
              <p className="font-medium text-gray-900">{car.jenis_mobil || '-'}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Kapasitas</p>
              <p className="font-medium text-gray-900">{car.capacity ? `${car.capacity} orang` : '-'}</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-lg font-medium mb-3">Deskripsi</h3>
            <p className="text-gray-700 leading-relaxed">
              {car.description || 'Tidak ada deskripsi tersedia.'}
            </p>
          </div>
        </div>


      </main>
    </div>
  );
}
