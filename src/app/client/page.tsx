"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import { Search, MapPin, Calendar, Filter, X } from 'lucide-react';
import { CarCard } from '@/components/car/CarCard';
import { CarCardSkeleton } from '@/components/car/CarCardSkeleton';
import { HeroSkeleton } from '@/components/HeroSkeleton';
import { useCars } from '@/hooks/useCars';

import { Car } from '@/lib/api';

// Fallback data in case API is not available
const fallbackCars: Car[] = [
  {
    id: '1',
    slug: 'toyota-avanza-veloz',
    name: 'Toyota Avanza Veloz',
    brand: 'Toyota',
    image: '/placeholder-car.jpg',
    description: 'MPV keluarga dengan desain sporty dan fitur lengkap',
    price: 315000000,
    showroom: 'Jakarta Selatan',
    jenis_mobil: 'MPV',
    engine_type: 'Bensin',
    year: 2023,
    engine_capacity: 1500,
    capacity: 7,
    salesId: '1',
    sales: {
      id: '1',
      name: 'Sales 1',
      email: 'sales1@example.com'
    },
    bookings: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    slug: 'honda-hrv-turbo',
    name: 'Honda HR-V Turbo',
    brand: 'Honda',
    image: '/placeholder-car.jpg',
    description: 'SUV premium dengan mesin turbo bertenaga',
    price: 499000000,
    showroom: 'Jakarta Pusat',
    jenis_mobil: 'SUV',
    engine_type: 'Bensin',
    year: 2023,
    engine_capacity: 1500,
    capacity: 5,
    salesId: '2',
    sales: {
      id: '2',
      name: 'Sales 2',
      email: 'sales2@example.com'
    },
    bookings: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    slug: 'mitsubishi-xpander-ultimate',
    name: 'Mitsubishi Xpander Ultimate',
    brand: 'Mitsubishi',
    image: '/placeholder-car.jpg',
    description: 'MPV tangguh dengan fitur premium dan ruang kabin luas',
    price: 289000000,
    showroom: 'Tangerang',
    jenis_mobil: 'MPV',
    engine_type: 'Bensin',
    year: 2023,
    engine_capacity: 1500,
    capacity: 7,
    salesId: '1',
    sales: {
      id: '1',
      name: 'Sales 1',
      email: 'sales1@example.com'
    },
    bookings: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

export default function Home() {
  const { cars, loading, error } = useCars();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter cars based on search query
  const filteredCars = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return cars.length > 0 ? cars : fallbackCars;
    
    return (cars.length > 0 ? cars : fallbackCars).filter(car => {
      return (
        car.brand.toLowerCase().includes(query) ||
        car.engine_type.toLowerCase().includes(query) ||
        car.jenis_mobil.toLowerCase().includes(query) ||
        car.name.toLowerCase().includes(query)
      );
    });
  }, [cars, searchQuery]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the filteredCars dependency on searchQuery
  };
  
  // Show skeleton while loading initial data
  const isLoading = loading && cars.length === 0;
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <HeroSkeleton />
        
        {/* Featured Cars Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-24" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm">
                <CarCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-500 text-lg font-medium mb-2">Gagal memuat data mobil</div>
          <p className="text-gray-600 mb-4">Terjadi kesalahan saat memuat data: {error.message}</p>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Hero Section */}
      <div className="relative text-white py-16 min-h-[500px] flex items-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-blue-100"
          style={{
            backgroundImage: 'url(/hero.jpg)',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "multiply"
          }}
        >
          {/* Light overlay */}
          <div className="absolute inset-0 bg-blue-600 opacity-30"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Temukan Mobil Impian Anda</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">Nikmati pengalaman test drive terbaik dengan pilihan mobil terbaru dan terbaik</p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-4xl mx-auto bg-white/90 rounded-xl shadow-xl p-4 sm:p-6 mb-8">
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                {/* Search Input */}
                <div className="w-full">
                  <Input 
                    type="text"
                    leftIcon={
                      <Search className="h-5 w-5 text-gray-800" />
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari berdasarkan merek, tipe mesin, atau jenis mobil..."
                    className="h-14 w-full bg-white border border-gray-200 text-gray-800 placeholder-gray-400
                      focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:ring-opacity-50
                      hover:border-gray-300 transition-colors duration-200 rounded-lg shadow-sm"
                  />
                </div>
                
                {/* Search Button */}
                <Button 
                  type="submit"
                  className="h-14 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium text-base px-6 md:px-8
                    transition-all duration-200 hover:shadow-lg rounded-lg whitespace-nowrap flex-shrink-0 cursor-pointer"
                >
                  Cari Mobil
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Featured Cars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Mobil Tersedia</h2>
          <Button variant="outline" className="flex items-center">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
        </div>

        {filteredCars.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Tidak ada mobil yang ditemukan untuk pencarian "{searchQuery}"</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setSearchQuery('')}
            >
              Tampilkan Semua Mobil
            </Button>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <CarCard 
              key={car.id} 
              car={car} 
              formatPrice={formatPrice} 
            />
          ))}
        </div>
        )}
      </div>
    </div>
  );
}
