'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, addMonths } from 'date-fns';
import { id } from 'date-fns/locale';
import { CalendarIcon, ChevronLeft, ChevronRight, LogIn } from 'lucide-react';
import { format as formatDate } from 'date-fns';
import { signIn, useSession } from 'next-auth/react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Calendar } from '@/components/ui/Calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import { AuthModal } from '@/components/AuthModal';

const showrooms = [
  'Jakarta Selatan',
  'Jakarta Utara',
  'Jakarta Barat',
  'Jakarta Timur',
  'Jakarta Pusat',
  'Tangerang',
  'Bekasi',
  'Depok',
  'Bogor',
];

const timeSlots = [
  '09:00',
  '10:00',
  '11:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
];

const formSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().min(10, 'Nomor telepon minimal 10 digit'),
  showroom: z.string().min(1, 'Pilih showroom'),
  tanggal: z.date({
    required_error: 'Pilih tanggal test drive',
  }),
  jam: z.string().min(1, 'Pilih jam test drive'),
});

type FormValues = z.infer<typeof formSchema>;

interface PageProps {
  params: { slug: string };
  searchParams: { 
    carId?: string;
    carName?: string;
    salesId?: string;
    salesName?: string;
    salesPhone?: string;
  };
}

export default function BookingPage({
  params,
  searchParams,
}: PageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { createBooking } = useStore();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormValues | null>(null);
  const salesPhone = searchParams.salesPhone || '';
  const salesName = searchParams.salesName || 'Sales';
  const salesId = searchParams.salesId || '';

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
      phone: '',
      tanggal: new Date(),
      jam: '09:00',
      showroom: '',
    },
  });

  const { register, handleSubmit, setValue, watch, formState: { errors } } = form;

  const selectedDate = watch('tanggal');

  useEffect(() => {
    // Save form data to session storage if user navigates away
    const handleBeforeUnload = () => {
      if (Object.keys(form.getValues()).length > 0) {
        sessionStorage.setItem('bookingFormData', JSON.stringify(form.getValues()));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Load saved form data if exists
    const savedFormData = sessionStorage.getItem('bookingFormData');
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      // Convert string date back to Date object
      if (parsedData.tanggal) {
        parsedData.tanggal = new Date(parsedData.tanggal);
      }
      form.reset(parsedData);
      sessionStorage.removeItem('bookingFormData');
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [form]);

  const handleSubmitForm = async (data: FormValues) => {
    if (status === 'unauthenticated') {
      setFormData(data);
      setIsAuthModalOpen(true);
      return;
    }
    
    await submitBooking(data);
  };

  // Handle successful login from AuthModal
  const handleLoginSuccess = async () => {
    if (formData) {
      await submitBooking(formData);
    }
  };

  const submitBooking = async (data: FormValues) => {
    try {
      setIsLoading(true);
      
      if (!searchParams.carId || !searchParams.carName) {
        throw new Error('Informasi mobil tidak lengkap');
      }

      await createBooking({
        ...data,
        mobilId: searchParams.carId,
        mobilName: searchParams.carName,
        tanggal: format(data.tanggal, 'yyyy-MM-dd'),
      });

      toast({
        title: 'Berhasil!',
        description: 'Booking test drive berhasil dibuat.',
      });

      if (!salesPhone) {
        throw new Error('Nomor sales tidak ditemukan');
      }
      
      // Format phone number to remove any non-digit characters
      const formattedPhone = salesPhone.replace(/\D/g, '');
      const pesan = encodeURIComponent(
        `Halo, saya ${data.name} sudah booking test drive ${searchParams.carName} pada ${format(data.tanggal, 'dd MMMM yyyy', { locale: id })} pukul ${data.jam}. Mohon konfirmasinya, ya!`
      );
      const waUrl = `https://wa.me/${formattedPhone}?text=${pesan}`;

      window.open(waUrl, "_blank");

      // Redirect to home after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Gagal membuat booking. Silakan coba lagi.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const CustomHeader = ({ date, onPrev, onNext }: { date: Date; onPrev: () => void; onNext: () => void }) => (
    <div className="flex items-center justify-between px-1">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="md"
          className="h-7 w-7 p-0 flex items-center justify-center text-black"
          onClick={onPrev}
          type="button"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-lg font-bold text-gray-900">
          {format(date, 'MMMM yyyy', { locale: id })}
        </span>
        <Button
          variant="ghost"
          size="md"
          className="h-7 w-7 p-0 flex items-center justify-center text-black"
          onClick={onNext}
          type="button"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:underline inline-flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Kembali
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Form Booking Test Drive
            </h1>

            <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className='text-black'>Nama Lengkap</Label>
                  <Input
                    id="name"
                    placeholder="Masukkan nama lengkap"
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className='text-black'>Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contoh@email.com"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className='text-black'>Nomor Telepon</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="081234567890"
                    {...register('phone')}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="showroom" className='text-black'>Pilih Showroom</Label>
                  <select
                    id="showroom"
                    className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    {...register('showroom')}
                  >
                    <option value="">Pilih Showroom</option>
                    {showrooms.map((showroom) => (
                      <option key={showroom} value={showroom}>
                        {showroom}
                      </option>
                    ))}
                  </select>
                  {errors.showroom && (
                    <p className="text-sm text-red-500">
                      {errors.showroom.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tanggal" className='text-black'>Tanggal Test Drive</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal text-black',
                          !selectedDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, 'PPP', { locale: id })
                        ) : (
                          <span>Pilih tanggal</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-4 bg-white rounded-lg shadow-lg border border-gray-200 w-[350px] md:w-[400px]" align="start">
                      <div className="bg-white p-4 rounded-lg">
                        <CustomHeader 
                          date={selectedDate || new Date()} 
                          onPrev={() => {
                            const newDate = new Date(selectedDate || new Date());
                            newDate.setMonth(newDate.getMonth() - 1);
                            setValue('tanggal', newDate);
                          }}
                          onNext={() => {
                            const newDate = new Date(selectedDate || new Date());
                            newDate.setMonth(newDate.getMonth() + 1);
                            setValue('tanggal', newDate);
                          }}
                        />
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date: Date) => setValue('tanggal', date!)}
                          disabled={(date: Date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today;
                          }}
                          locale={id}
                          components={{
                            IconLeft: () => null,
                            IconRight: () => null,
                          }}
                          classNames={{
                            selected: 'bg-blue-600 opacity-80 text-white font-bold',
                            today: 'text-gray-300 line-through',
                            disabled: 'text-gray-300 line-through',
                            root: 'w-full',
                            months: 'w-full text-black mt-4',
                            table: 'w-full',
                            head_cell: 'text-gray-600 font-normal text-sm',
                            cell: 'p-0',
                            day: 'w-10 h-10 m-0.5 rounded-md text-center hover:bg-gray-100 text-black',
                            nav_button: 'hidden',
                            caption: 'hidden',
                            caption_label: 'hidden',
                            nav: 'hidden',
                          }}
                          styles={{
                            day: {
                              margin: 0,
                            },
                            table: {
                              width: '100%',
                              margin: '0',
                            },
                            head_cell: {
                              textTransform: 'none',
                            },
                          }}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  {errors.tanggal && (
                    <p className="text-sm text-red-500">
                      {errors.tanggal.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jam" className='text-black'>Pilih Jam</Label>
                  <select
                    id="jam"
                    className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    {...register('jam')}
                  >
                    <option value="">Pilih Jam</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time} WIB
                      </option>
                    ))}
                  </select>
                  {errors.jam && (
                    <p className="text-sm text-red-500">{errors.jam.message}</p>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Memproses...' : 'Booking Sekarang'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialMode="login"
      />
    </div>
  );
}
