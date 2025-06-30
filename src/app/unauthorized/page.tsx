// src/app/unauthorized/page.tsx
export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Akses Ditolak</h1>
        <p className="text-gray-600 mb-6">
          Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>
        <div className="space-y-3">
          <a 
            href="/" 
            className="block w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
          >
            Kembali ke Beranda
          </a>
          <a 
            href="/auth/signin" 
            className="block w-full px-4 py-2 border border-transparent rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Masuk
          </a>
        </div>
      </div>
    </div>
  );
}