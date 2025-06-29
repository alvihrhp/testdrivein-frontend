"use client";

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import { AuthModal } from './AuthModal';
import { Button } from './ui/Button';

export function Header() {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">TESTDRIVEIN</Link>
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
          <Link href="/mobil" className="text-gray-700 hover:text-blue-600 font-medium">Mobil</Link>
          <Link href="/tentang-kami" className="text-gray-700 hover:text-blue-600 font-medium">Tentang Kami</Link>
          <Link href="/kontak" className="text-gray-700 hover:text-blue-600 font-medium">Kontak</Link>
        </nav>
        <div className="flex items-center">
          {status === 'authenticated' ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center focus:outline-none"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-500">
                  <span className="text-blue-600 font-semibold text-lg">
                    {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-4 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  {/* Arrow/triangle pointing to the profile icon */}
                  <div className="absolute -top-2 right-3 w-4 h-4 transform rotate-45 bg-white border-t border-l border-gray-200"></div>
                  
                  <div className="relative z-10 bg-white rounded-md">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{session.user?.name}</p>
                    </div>
                    <Link 
                      href="/bookingan-saya" 
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Bookingan Saya
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <AuthModal 
              trigger={
                <Button 
                  className="bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transition-transform duration-200"
                  size="sm"
                >
                  Login / Register
                </Button>
              }
              initialMode="login"
            />
          )}
        </div>
      </div>
    </header>
  );
}
