import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Car } from '@/lib/api';
import { Star, MapPin, Users, Fuel, BatteryPlus, Zap, Car as CarIcon } from 'lucide-react';

interface CarCardProps {
  car: Car;
  formatPrice: (price: number) => string;
}

export function CarCard({ car, formatPrice }: CarCardProps) {
  // Fungsi untuk mendapatkan warna ikon kapasitas kursi
  const getCapacityColor = (capacity: number) => {
    switch (capacity) {
      case 2:
        return 'text-[#EF5350]'; // Merah Soft
      case 5:
        return 'text-[#42A5F5]'; // Biru Netral
      case 7:
        return 'text-[#388E3C]'; // Hijau Tua
      default:
        return 'text-gray-600';
    }
  };

  // Fungsi untuk mendapatkan warna berdasarkan jenis mobil
  const getCarTypeColor = (type: string) => {
    const typeLower = type.toLowerCase();
    switch (typeLower) {
      case 'suv':
        return 'text-[#2E7D32]';
      case 'mpv':
        return 'text-[#42A5F5]';
      case 'hatchback':
        return 'text-[#FBC02D]';
      case 'sedan':
        return 'text-[#616161]';
      case 'coupe':
        return 'text-[#E53935]';
      case 'wagon':
        return 'text-[#8D6E63]';
      default:
        return 'text-gray-600';
    }
  };

  const carTypeColor = getCarTypeColor(car.jenis_mobil);
  const capacityColor = getCapacityColor(Number(car.capacity));

  return (
    <div className="group flex flex-col h-full bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-50">
      {/* Image with badge */}
      <div className="relative w-full min-h-[240px] aspect-[3/2] overflow-hidden">
        {car.image ? (
          <Image
            src={car.image}
            alt={car.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Gambar Mobil</span>
          </div>
        )}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold text-gray-800 flex items-center shadow-sm">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1.5" />
          <span>4.8</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col h-full p-5">
        <div className="flex-1">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-extrabold text-gray-900 mb-1.5 truncate">{car.name}</h3>
              <div className="flex items-center text-base font-medium text-gray-700 mb-4">
                <MapPin className="h-4.5 w-4.5 mr-1.5" />
                <span className="truncate font-semibold">{car.showroom || 'Jakarta'}</span>
              </div>
            </div>
            <span className="text-lg font-bold text-blue-600 whitespace-nowrap ml-2">
              {formatPrice(car.price)}
            </span>
          </div>
          
          {/* Car Specs */}
          <div className="grid grid-cols-3 gap-4 mt-4 mb-5 pb-4 border-b border-gray-100">
            <div className="flex flex-col items-center text-center">
              <Users className={`h-6 w-6 mb-1.5 ${capacityColor}`} />
              <span className="text-sm font-bold text-gray-700">{car.capacity} Kursi</span>
            </div>
            <div className="flex flex-col items-center text-center">
              {car.engine_type.toLowerCase() === 'electric' ? (
                <Zap className="h-6 w-6 text-blue-500 mb-1.5" />
              ) : car.engine_type.toLowerCase() === 'hybrid' ? (
                <BatteryPlus className="h-6 w-6 text-green-500 mb-1.5" />
              ) : (
                <Fuel className="h-6 w-6 text-amber-500 mb-1.5" />
              )}
              <span className="text-sm font-bold text-gray-700 capitalize">{car.engine_type.toLowerCase()}</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <CarIcon className={`h-6 w-6 mb-1.5 ${carTypeColor}`} />
              <span className="text-sm font-bold text-gray-700 capitalize">{car.jenis_mobil}</span>
            </div>
          </div>
        </div>

        <Link href={`/mobil/${car.slug}`} className="block w-full">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300 rounded-lg py-2 font-medium cursor-pointer">
            Lihat Detail
          </Button>
        </Link>
      </div>
    </div>
  );
}
