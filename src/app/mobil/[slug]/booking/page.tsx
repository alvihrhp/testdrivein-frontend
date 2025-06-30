'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, addMonths, isAfter, isToday } from 'date-fns';
import { id } from 'date-fns/locale';
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, User, Mail, Phone, Loader2, MessageCircle } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { AuthModal } from '@/components/AuthModal';

// Styling for the calendar header
const calendarStyles = `
  .rdp {
    --rdp-cell-size: 32px;
    --rdp-accent-color: #2563eb;
    --rdp-background-color: #eff6ff;
    margin: 0;
  }
  .rdp-head_cell {
    color: #3b82f6;
    font-size: 0.75rem;
    font-weight: 500;
  }
  .rdp-button {
    border-radius: 9999px;
  }
  .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
    background-color: #2563eb;
    color: white;
  }
  .rdp-button[disabled],
  .rdp-day_disabled {
    color: #d1d5db !important;
    background-color: transparent !important;
    cursor: not-allowed;
  }
  .rdp-day_today {
    border: 1px solid #60a5fa;
  }
  .rdp-caption {
    display: none;
  }
  .custom-calendar-header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 0;
    background: white;
    border-bottom: 1px solid #e0f2fe;
    border-top-left-radius: 0.75rem;
    border-top-right-radius: 0.75rem;
  }
  .custom-calendar-header-content {
    display: flex;
    align-items: center;
  }
  .custom-calendar-header button {
    color: #2563eb;
    background: transparent;
    border: none;
    border-radius: 9999px;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .custom-calendar-header button:hover {
    background-color: #eff6ff;
  }
  .custom-calendar-header button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .custom-calendar-header span {
    font-weight: 600;
    color: #1e40af;
    margin: 0 0.5rem;
  }
`;
import {
  Button,
  Input,
  Label,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast
} from '@/components/ui';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';

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
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  showroom: z.string().min(1, 'Please select a showroom'),
  tanggal: z.date({
    required_error: 'Please select a test drive date',
  }),
  jam: z.string().min(1, 'Please select a test drive time'),
  notes: z.string().optional(),
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

interface CustomHeaderProps {
  date: Date;
  onPrev: () => void;
  onNext: () => void;
}

export default function BookingPage({ params, searchParams }: PageProps) {
  const { data: session, status } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      setShowAuthModal(true);
    }
  }, [status]);
  
  const handleAuthSuccess = async () => {
    setShowAuthModal(false);
    // Retry form submission after successful auth
    if (form.formState.isValid) {
      await form.handleSubmit(onSubmit)();
    }
  };
  const { toast } = useToast?.() || {};
  const { createBooking } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      showroom: '',
      tanggal: undefined,
      jam: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!session?.user) {
      setShowAuthModal(true);
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Format the date to ISO string
      const formattedValues = {
        ...values,
        tanggal: values.tanggal instanceof Date ? values.tanggal.toISOString() : values.tanggal,
        mobilId: searchParams.carId || '',
        mobilName: searchParams.carName || '',
        salesId: searchParams.salesId || '',
        salesName: searchParams.salesName || '',
        salesPhone: searchParams.salesPhone || '',
      };

      await createBooking(formattedValues);

      if (toast) {
        toast({
          title: 'Booking Berhasil',
          description: 'Kami akan segera menghubungi Anda untuk konfirmasi test drive.',
          variant: 'default',
        });
      }

      router.push('/client');
    } catch (error) {
      console.error('Booking error:', error);
      if (toast) {
        toast({
          title: 'Gagal Membuat Booking',
          description: error instanceof Error ? error.message : 'Terjadi kesalahan. Silakan coba lagi.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Set minimum date to today for the calendar
  const minDate = new Date(today);
  const maxDate = new Date();
  maxDate.setMonth(today.getMonth() + 2); // Allow booking up to 2 months in advance
  
  const isDateDisabled = (date: Date) => {
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return compareDate < today;
  };
  
  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const [month, setMonth] = useState(today);

  const handleMonthChange = (increment: number) => {
    setMonth(addMonths(month, increment));
  };

  if (status === 'loading' || !isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{calendarStyles}</style>
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => {
          setShowAuthModal(false);
          router.back();
        }} 
        onLoginSuccess={handleAuthSuccess}
        initialMode="login"
      />
      <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white">
        <div className="mb-8">
          <Button
            variant="ghost"
            className="text-blue-600 hover:bg-blue-50 mb-6 pl-0"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Kembali
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Test Drive
          </h1>
          <p className="text-gray-600">
            Lengkapi data diri Anda untuk melanjutkan pemesanan
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {searchParams.carName || 'Mobil Pilihan Anda'}
            </h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-blue-500" />
                <span>Showroom Terdekat</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-blue-500" />
                <span>Durasi: 30 menit</span>
              </div>
            </div>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Data Diri</h3>
                
                <div className="space-y-1">
                  <Label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700">
                    <User className="h-4 w-4 mr-2 text-blue-500" />
                    Nama Lengkap
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      placeholder="Masukkan nama lengkap"
                      className={cn(
                        'pl-10',
                        form.formState.errors.name && 'border-red-500'
                      )}
                      {...form.register('name')}
                      disabled={isSubmitting}
                    />
                    {form.formState.errors.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700">
                    <Mail className="h-4 w-4 mr-2 text-blue-500" />
                    Email
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@contoh.com"
                      className={cn(
                        'pl-10',
                        form.formState.errors.email && 'border-red-500'
                      )}
                      {...form.register('email')}
                      disabled={isSubmitting}
                    />
                    {form.formState.errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="phone" className="flex items-center text-sm font-medium text-gray-700">
                    <Phone className="h-4 w-4 mr-2 text-blue-500" />
                    Nomor Telepon
                  </Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      placeholder="0812-3456-7890"
                      className={cn(
                        'pl-10',
                        form.formState.errors.phone && 'border-red-500'
                      )}
                      {...form.register('phone')}
                      disabled={isSubmitting}
                    />
                    {form.formState.errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {form.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Pilih Showroom
                  </Label>
                  <div className="relative">
                    <Select
                      onValueChange={(value: string) => form.setValue('showroom', value)}
                      value={form.watch('showroom')}
                      name="showroom"
                    >
                      <SelectTrigger className={cn(
                        'h-12 w-full pl-10 bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500',
                        form.formState.errors.showroom && 'border-red-500',
                        'text-blue-600 hover:text-blue-700 hover:border-blue-400',
                        'data-[state=open]:text-blue-700',
                        'group'
                      )}>
                        <MapPin className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 group-hover:text-blue-500" />
                        <SelectValue 
                          className="pl-5 text-blue-600 group-hover:text-blue-700"
                          placeholder="Pilih showroom terdekat"
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-300 shadow-lg rounded-md mt-1 py-1">
                        {showrooms.map((showroom) => (
                          <SelectItem 
                            key={showroom} 
                            value={showroom}
                            className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700"
                          >
                            {showroom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {form.formState.errors.showroom && (
                    <p className="mt-1 text-sm text-red-600">
                      {form.formState.errors.showroom.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                    Catatan (Opsional)
                  </Label>
                  <textarea
                    id="notes"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
                    placeholder="Ada catatan khusus untuk kami?"
                    {...form.register('notes')}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ringkasan</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Kendaraan</span>
                    <span className="text-sm font-medium text-gray-900">{searchParams.carName || '-'}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tanggal</span>
                    <span className="text-sm font-medium text-gray-900">
                      {form.watch('tanggal') 
                        ? format(form.watch('tanggal'), 'EEEE, d MMMM yyyy', { locale: id })
                        : 'Pilih tanggal'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Jam</span>
                    <span className="text-sm font-medium text-gray-900">
                      {form.watch('jam') || 'Pilih jam'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Lokasi</span>
                    <span className="text-sm font-medium text-gray-900">
                      {form.watch('showroom') || 'Pilih showroom'}
                    </span>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">
                      Dengan mengklik 'Konfirmasi Pesanan', Anda menyetujui Syarat & Ketentuan yang berlaku.
                    </p>
                    <Button
                      type="button"
                      className="w-full py-3 text-base font-medium bg-green-600 hover:bg-green-700"
                      disabled={isSubmitting || !form.formState.isValid}
                      onClick={() => {
                        if (!session?.user) {
                          setShowAuthModal(true);
                          return;
                        }

                        const selectedDate = form.watch('tanggal');
                        if (!selectedDate) return;

                        // Format pesan WhatsApp
                        const message = `Halo, saya ${session?.user?.name || 'Pelanggan'},%0A%0A` +
                          `Saya ingin mengkonfirmasi pesanan test drive dengan detail berikut:%0A` +
                          `- Nama: ${form.getValues('name')}%0A` +
                          `- No. HP: ${form.getValues('phone')}%0A` +
                          `- Mobil: ${searchParams.carName || '-'}%0A` +
                          `- Tanggal: ${format(new Date(selectedDate), 'EEEE, d MMMM yyyy', { locale: id })}%0A` +
                          `- Jam: ${form.getValues('jam')}%0A` +
                          `- Lokasi: ${form.getValues('showroom')}%0A%0A` +
                          `Apakah jadwal tersebut masih tersedia?%0A%0A` +
                          `Terima kasih.`;
                        
                        const phoneNumber = searchParams.salesPhone || '';
                        if (phoneNumber) {
                          window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
                        } else {
                          toast({
                            title: 'Error',
                            description: 'Nomor telepon sales tidak tersedia',
                            variant: 'destructive',
                          });
                        }
                      }}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="animate-spin mr-2 h-4 w-4" />
                          Memproses...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <MessageCircle className="h-5 w-5 mr-2" />
                          Konfirmasi via WhatsApp
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700">
                  Tanggal Test Drive
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      type="button"
                      className={cn(
                        'w-full justify-start text-left font-normal h-12 bg-white text-black',
                        !form.watch('tanggal') && 'text-gray-400',
                        form.formState.errors.tanggal && 'border-red-500'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                      {form.watch('tanggal') ? (
                        format(new Date(form.watch('tanggal')), 'EEEE, d MMMM yyyy', { locale: id })
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border border-blue-100 shadow-xl overflow-hidden bg-white rounded-xl">
                    <div className="custom-calendar-header">
                      <div className="custom-calendar-header-content">
                        <span className="text-blue-600 text-lg leading-none mr-1">[</span>
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleMonthChange(-1);
                          }}
                          disabled={month.getMonth() === new Date().getMonth() && month.getFullYear() === new Date().getFullYear()}
                          className="flex items-center justify-center w-8 h-8 hover:bg-blue-50 rounded-full"
                        >
                          <ChevronLeft className="h-3 w-3" />
                        </button>
                        <span className="text-base font-bold text-blue-700 px-2">
                          {format(month, 'MMMM yyyy', { locale: id })}
                        </span>
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleMonthChange(1);
                          }}
                          className="flex items-center justify-center w-8 h-8 hover:bg-blue-50 rounded-full"
                        >
                          <ChevronRight className="h-3 w-3" />
                        </button>
                        <span className="text-blue-600 text-lg leading-none ml-1">]</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <DayPicker
                        mode="single"
                        selected={form.watch('tanggal') ? new Date(form.watch('tanggal')) : undefined}
                        onSelect={(date: Date | undefined) => {
                          if (date) {
                            // Ensure time is set to beginning of day for consistency
                            const selectedDate = new Date(date);
                            selectedDate.setHours(0, 0, 0, 0);
                            form.setValue('tanggal', selectedDate);
                            form.setValue('jam', ''); // Reset time when date changes
                          }
                        }}
                        disabled={isDateDisabled}
                        fromDate={minDate}
                        toDate={maxDate}
                        classNames={{
                          months: 'w-full',
                          month: 'w-full p-0',
                          table: 'w-full border-collapse',
                          day_disabled: 'text-gray-300',
                          day_today: 'border border-blue-400 text-blue-700',
                          head_row: 'flex justify-between w-full mb-2',
                          head_cell: 'text-blue-500 text-xs font-medium w-8 h-8 flex items-center justify-center',
                          row: 'flex w-full',
                          cell: 'w-8 h-8 m-1 flex items-center justify-center',
                          day: 'w-8 h-8 flex items-center justify-center rounded-full text-sm font-normal text-blue-700 hover:bg-blue-50',
                          day_selected: 'bg-blue-600 text-white hover:bg-blue-600',
                          day_hidden: 'invisible',
                          day_outside: 'text-blue-300',
                          day_range_middle: 'bg-blue-100 text-blue-700',
                        }}
                        components={{
                          IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" {...props} />,
                          IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" {...props} />
                        } as any}
                        locale={id}
                        showOutsideDays
                        fixedWeeks
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                {form.formState.errors.tanggal && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.tanggal.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700">
                  Jam Test Drive
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      type="button"
                      variant={form.watch('jam') === time ? 'primary' : 'outline'}
                      className={cn(
                        'h-12 w-full justify-start transition-colors',
                        form.watch('jam') === time
                          ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700'
                          : 'text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400'
                      )}
                      onClick={() => {
                        form.setValue('jam', time);
                      }}
                      disabled={isSubmitting}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
                {form.formState.errors.jam && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.jam.message}
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
