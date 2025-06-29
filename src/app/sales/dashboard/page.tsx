import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function DashboardPage() {
  // Since we're using middleware for auth, we can assume the user is authenticated
  const userName = 'Admin'; // You can get this from user session if needed

  const stats = [
    { name: 'Total Pendapatan', value: 'Rp 1.250.000.000', change: '+12%', changeType: 'positive' },
    { name: 'Mobil Terjual', value: '45', change: '+8%', changeType: 'positive' },
    { name: 'Pelanggan Baru', value: '32', change: '+5%', changeType: 'positive' },
    { name: 'Konversi', value: '3.2%', change: '-0.5%', changeType: 'negative' },
  ];

  const recentCars = [
    { id: 1, name: 'Toyota Avanza', price: 'Rp 250.000.000', status: 'Tersedia' },
    { id: 2, name: 'Honda HR-V', price: 'Rp 450.000.000', status: 'Terjual' },
    { id: 3, name: 'Mitsubishi Xpander', price: 'Rp 280.000.000', status: 'Tersedia' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Dashboard</h1>
          <p className="text-gray-800">
            Selamat datang kembali, {userName}!
          </p>
        </div>
        <Link 
          href="/sales/mobil/tambah"
          className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 mt-4 md:mt-0"
        >
          Tambah Mobil Baru
        </Link>
      </div>

      {/* Statistik */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.name}
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change} dari bulan lalu
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Ringkasan Penjualan */}
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Penjualan</CardTitle>
            <CardDescription>
              Ringkasan penjualan 30 hari terakhir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center bg-muted rounded-lg">
              <p className="text-muted-foreground">Grafik penjualan akan ditampilkan di sini</p>
            </div>
          </CardContent>
        </Card>

        {/* Mobil Terbaru */}
        <Card>
          <CardHeader>
            <CardTitle>Mobil Terbaru</CardTitle>
            <CardDescription>
              Daftar mobil yang baru ditambahkan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCars.map((car) => (
                <div key={car.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{car.name}</p>
                    <p className="text-sm text-muted-foreground">{car.price}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    car.status === 'Tersedia' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {car.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
