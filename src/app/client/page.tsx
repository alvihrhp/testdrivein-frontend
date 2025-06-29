"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { Search, MapPin, Calendar, Filter, X } from 'lucide-react';
import { CarCard } from '@/components/car/CarCard';
import { CarCardSkeleton } from '@/components/car/CarCardSkeleton';
import { HeroSkeleton } from '@/components/HeroSkeleton';
import { useCars } from '@/hooks/useCars';
import type { Car } from '@/types/car';

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
      email: 'sales1@example.com',
      phone: '081234567890'
    },
    bookings: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    slug: 'honda-br-v',
    name: 'Honda BR-V',
    brand: 'Honda',
    image: '/placeholder-car.jpg',
    description: 'SUV 7-seater dengan performa tangguh dan nyaman',
    price: 350000000,
    showroom: 'Jakarta Utara',
    jenis_mobil: 'SUV',
    engine_type: 'Bensin',
    year: 2023,
    engine_capacity: 1500,
    capacity: 7,
    salesId: '2',
    sales: {
      id: '2',
      name: 'Sales 2',
      email: 'sales2@example.com',
      phone: '081234567891'
    },
    bookings: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    slug: 'toyota-raize',
    name: 'Toyota Raize',
    brand: 'Toyota',
    image: '/placeholder-car.jpg',
    description: 'Compact SUV dengan desain modern dan irit bahan bakar',
    price: 280000000,
    showroom: 'Jakarta Barat',
    jenis_mobil: 'SUV',
    engine_type: 'Bensin',
    year: 2023,
    engine_capacity: 1200,
    capacity: 5,
    salesId: '3',
    sales: {
      id: '3',
      name: 'Sales 3',
      email: 'sales3@example.com',
      phone: '081234567892'
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
const { cars = [], loading: isLoading, error } = useCars();
const [searchQuery, setSearchQuery] = useState('');

  // Filter cars based on search query
  const filteredCars = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return cars.length > 0 ? cars : fallbackCars;

    return (cars.length > 0 ? cars : fallbackCars).filter((car: Car) => {
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
  const isInitialLoading = isLoading && cars.length === 0;
  
  if (isInitialLoading) {
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
        <div className="absolute inset-0 bg-black/60 z-0"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Temukan Mobil Impian Anda</h1>
            <p className="text-xl mb-8">Nikmati pengalaman test drive yang nyaman dan profesional dengan berbagai pilihan mobil terbaik.</p>
            
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Cari mobil, merek, atau tipe..."
                  className="pl-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Cari Mobil
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Featured Cars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Mobil Tersedia</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
        
        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car: Car) => (
              <CarCard 
                key={car.id}
                car={car}
                formatPrice={formatPrice}
              />
            ))} 
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Tidak ada mobil yang ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
