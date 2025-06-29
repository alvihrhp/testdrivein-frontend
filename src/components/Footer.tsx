import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">BOXCARS</h3>
            <p className="text-gray-400">Solusi terbaik untuk pengalaman test drive mobil impian Anda.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Perusahaan</h4>
            <ul className="space-y-2">
              <li><Link href="/tentang-kami" className="text-gray-400 hover:text-white">Tentang Kami</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
              <li><Link href="/karir" className="text-gray-400 hover:text-white">Karir</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Bantuan</h4>
            <ul className="space-y-2">
              <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
              <li><Link href="/kontak" className="text-gray-400 hover:text-white">Kontak Kami</Link></li>
              <li><Link href="/syarat-ketentuan" className="text-gray-400 hover:text-white">Syarat & Ketentuan</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Ikuti Kami</h4>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white">FB</Link>
              <Link href="#" className="text-gray-400 hover:text-white">IG</Link>
              <Link href="#" className="text-gray-400 hover:text-white">TW</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p> {new Date().getFullYear()} BOXCARS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
