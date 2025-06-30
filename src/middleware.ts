import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/mobil',
  '/mobil/[slug]',
  '/tentang',
  '/kontak',
  '/register',
  '/tidak-diizinkan',
  '/api/auth',
  '/_next',
  '/favicon.ico',
  '/images',
  '/sales/login',
  '/auth/login',
];

// Configure which routes are protected and require specific roles
const protectedRoutes = [
  { path: '/sales', roles: ['SALES'] },
  { path: '/sales/dashboard', roles: ['SALES'] },
  { path: '/sales/leads', roles: ['SALES'] },
  { path: '/sales/mobil', roles: ['SALES'] },
  { path: '/sales/mobil/tambah', roles: ['SALES'] },
  { path: '/sales/mobil/[id]', roles: ['SALES'] },
  { path: '/sales/mobil/[id]/edit', roles: ['SALES'] },
];

export default withAuth(
  function middleware(request) {
    const { pathname } = request.nextUrl;
    
    // Skip middleware for public routes
    const isPublicRoute = publicRoutes.some(route => 
      pathname === route || 
      pathname.startsWith(route.replace(/\[.*?\]/, '')) ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api/auth') ||
      pathname.includes('.')
    );

    // If it's a public route, continue
    if (isPublicRoute) {
      return NextResponse.next();
    }

    // Check if the route is protected
    const protectedRoute = protectedRoutes.find(route => 
      pathname === route.path || pathname.startsWith(route.path.replace(/\[.*?\]/, ''))
    );

    if (protectedRoute) {
      const token = request.cookies.get('next-auth.session-token') || 
                  request.cookies.get('__Secure-next-auth.session-token');
      
      // If no token, redirect to login
      if (!token) {
        const url = new URL('/auth/login', request.url);
        url.searchParams.set('callbackUrl', encodeURI(request.url));
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = new URL(req.url);
        
        // Public routes are handled in the middleware function
        if (publicRoutes.some(route => 
          pathname === route || 
          pathname.startsWith(route.replace(/\[.*?\]/, ''))
        )) {
          return true;
        }

        // Protected routes require a valid token
        const protectedRoute = protectedRoutes.find(route => 
          pathname === route.path || pathname.startsWith(route.path.replace(/\[.*?\]/, ''))
        );

        if (protectedRoute) {
          if (!token) return false;
          // Type assertion for token
          const userToken = token as { role?: string };
          // Check if user has required role
          if (protectedRoute.roles && userToken.role) {
            return protectedRoute.roles.includes(userToken.role);
          }
          return true; // If no specific role required, just check if authenticated
        }

        // By default, allow access to other routes
        return true;
      },
    },
    pages: {
      signIn: '/auth/login',
      error: '/tidak-diizinkan',
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (except api/auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/(?!auth)|_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
