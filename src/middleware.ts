import { NextResponse, type NextRequest } from 'next/server';

// Daftar route yang tidak perlu autentikasi
const publicRoutes = [
  '/',
  '/mobil',
  '/mobil/[slug]',
  '/tentang',
  '/kontak',
  '/register',
  '/tidak-diizinkan',
  '/api',
  '/_next',
  '/favicon.ico',
  '/images',
  '/sales/login',
];

// Daftar route yang hanya bisa diakses oleh pengguna yang sudah login
const protectedRoutes = [
  '/sales',
  '/sales/dashboard',
  '/sales/leads',
  '/sales/mobil',
  '/sales/mobil/tambah',
  '/sales/mobil/[id]',
  '/sales/mobil/[id]/edit',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoggedIn = request.cookies.get('isAuthenticated')?.value === 'true';
  
  // Skip middleware untuk route public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || 
    pathname.startsWith(route + '/') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  );

  // Jika route public, lanjutkan
  if (isPublicRoute) {
    // Jika sudah login dan mencoba mengakses halaman login, redirect ke dashboard
    if (isLoggedIn && pathname.startsWith('/sales/login')) {
      return NextResponse.redirect(new URL('/sales/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Cek jika route termasuk yang dilindungi
  const isProtectedRoute = protectedRoutes.some(route => {
    // Handle dynamic routes seperti /mobil/[id]
    if (route.includes('[') && route.includes(']')) {
      const baseRoute = route.split('[')[0];
      return pathname.startsWith(baseRoute);
    }
    return pathname === route || pathname.startsWith(route + '/');
  });

  // Jika route tidak dilindungi, lanjutkan
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Jika sudah login, lanjutkan
  if (isLoggedIn) {
    return NextResponse.next();
  }

  // Jika belum login, redirect ke halaman login
  const loginUrl = new URL('/sales/login', request.url);
  loginUrl.searchParams.set('callbackUrl', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (image files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images/).*)',
  ],
};
