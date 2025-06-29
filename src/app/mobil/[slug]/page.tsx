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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center">
            <ArrowLeft className="h-5 w-5 mr-1" />
            <span>Kembali</span>
          </Link>
          <div className="ml-auto flex space-x-3">
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <Share2 className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-red-500">
              <Heart className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        {/* Top Section - Image + Booking */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Car Image Gallery */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Main Image */}
          <div className="relative aspect-video w-full bg-gray-100">
            <Image
              src={images[activeImageIndex] || '/placeholder-car.jpg'}
              alt={`${car.name} - ${activeImageIndex + 1}`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 80vw"
            />
            {/* Navigation Arrows - Only show if there are multiple images */}
            {totalImages > 1 && (
              <>
                <Link 
                  href={getImageUrl(prevImageIndex)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-all hover:scale-110"
                  aria-label="Previous image"
                  scroll={false}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Link>
                <Link 
                  href={getImageUrl(nextImageIndex)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-all hover:scale-110"
                  aria-label="Next image"
                  scroll={false}
                >
                  <ChevronRight className="h-6 w-6" />
                </Link>
              </>
            )}
          </div>
          
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
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Booking Test Drive</h2>
              <p className="text-gray-600 text-sm mb-4">
                Jadwalkan test drive untuk merasakan pengalaman berkendara mobil ini secara langsung.
              </p>
              
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
                <Button className="w-full py-4 text-base font-medium cursor-pointer">
                  <Calendar className="h-5 w-5 mr-2" />
                  Booking Sekarang
                </Button>
              </Link>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="font-medium mb-3">Lokasi Showroom</h3>
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                  <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-400">
                    Peta Lokasi
                  </div>
                </div>
                <p className="mt-2 text-sm text-black">
                  Jl. Contoh No. 123, Kota Bandung
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Car Details - Full Width */}
        <div className="w-full">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{car.name}</h1>
                  <p className="text-black">{car.brand} • {car.year}</p>
                </div>
                <p className="text-2xl font-bold text-blue-600 mt-2 sm:mt-0">
                  {formatCurrency(car.price)}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h2 className="text-lg font-semibold mb-3 text-black">Deskripsi</h2>
                <p className="text-gray-700 leading-relaxed">
                  {car.description || 'Tidak ada deskripsi tersedia.'}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="bg-blue-50 p-2 rounded-lg mr-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-black font-medium">Tahun</p>
                    <p className="font-medium text-black">{car.year}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-blue-50 p-2 rounded-lg mr-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-black font-medium">Showroom</p>
                    <p className="font-medium text-black">{car.showroom || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Spesifikasi */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 text-black">Spesifikasi</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-black font-medium">Tipe Mesin</p>
                  <p className="font-medium text-black">{car.engine_type || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-black font-medium">Kapasitas Mesin</p>
                  <p className="font-medium text-black">{car.engine_capacity ? `${car.engine_capacity} cc` : '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-black font-medium">Jenis Mobil</p>
                  <p className="font-medium text-black">{car.jenis_mobil || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-black font-medium">Kapasitas Penumpang</p>
                  <p className="font-medium text-black">{car.capacity || '-'} orang</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
