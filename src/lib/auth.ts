// Core NextAuth imports
import NextAuth, { type AuthOptions, type DefaultSession, type User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';

// Define role type
type UserRole = 'CLIENT' | 'SALES';

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      name?: string | null;
      email?: string | null;
    } & DefaultSession['user'];
    token: string;
  }

  interface User {
    id: string;
    role: UserRole;
    accessToken: string;
    name: string | null;
    email: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: UserRole;
    accessToken?: string;
  }
}

// Check for required environment variables
if (!process.env.NEXT_PUBLIC_API_URL) {
  console.warn('NEXT_PUBLIC_API_URL is not set. Please set it in your environment variables.');
}
if (!process.env.NEXTAUTH_SECRET) {
  console.warn('NEXTAUTH_SECRET is not set. Please set it in your environment variables.');
}

// Auth configuration
export const authOptions: AuthOptions = {
  // Custom pages
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('Authorize called with credentials:', credentials);
        if (!credentials) {
          console.error('No credentials provided');
          return null;
        }
        
        const { email, password } = credentials as {
          email?: string;
          password?: string;
        };

        if (!email || !password) {
          console.error('Email or password missing');
          return null;
        }

        try {
          // Handle login
          console.log('Attempting to log in with:', { email });
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email,
                password,
              }),
            }
          );

          let responseBody = '';
          try {
            responseBody = await response.text();
            console.log('Raw login response:', responseBody);
            
            // Try to parse as JSON, but handle non-JSON responses
            const responseData = responseBody ? JSON.parse(responseBody) : {};
            
            console.log('Login response:', {
              status: response.status,
              statusText: response.statusText,
              data: responseData,
              headers: Object.fromEntries(response.headers.entries())
            });

            if (!response.ok) {
              const errorMessage = responseData?.message || 
                                responseData?.error?.message || 
                                `Authentication failed (${response.status} ${response.statusText})`;
              console.error('Login failed:', errorMessage);
              throw new Error(errorMessage);
            }

            if (!responseData.success || !responseData.user || !responseData.token) {
              console.error('Invalid response format from login:', responseData);
              throw new Error('Invalid response format: missing required fields');
            }
            
            console.log('Login successful for user:', responseData.user.email);
            return {
              id: responseData.user.id,
              email: responseData.user.email,
              name: responseData.user.name,
              role: (responseData.user.role || 'CLIENT') as UserRole,
              accessToken: responseData.token,
            };
            
          } catch (e) {
            console.error('Error parsing login response:', {
              error: e,
              status: response.status,
              statusText: response.statusText,
              responseBody: responseBody || 'No response body',
              headers: Object.fromEntries(response.headers.entries())
            });
            throw new Error(`Invalid server response: ${response.status} ${response.statusText}`);
          }
          
          return null;
        } catch (error) {
          console.error('Authentication error:', error);
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error('An unknown error occurred');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      console.log('JWT callback:', { token, user, account });
      
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'CLIENT';
        token.accessToken = (user as any).accessToken;
      }
      
      // If we have an access token from the provider
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      
      console.log('Updated token:', token);
      return token;
    },
    async session({ session, token, user }) {
      console.log('Session callback:', { session, token, user });
      
      // If we have a token, update the session with token data
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as UserRole,
        };
        session.token = token.accessToken as string;
      }
      
      // If we have a user (from JWT), update the session with user data
      if (user) {
        session.user = {
          ...session.user,
          id: user.id,
          name: user.name,
          email: user.email,
          role: (user as any).role || 'CLIENT',
        };
        session.token = (user as any).accessToken;
      }
      
      console.log('Updated session:', session);
      return session;
    },
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code: string, metadata: any) {
      console.error('Auth error:', { code, metadata });
    },
    warn(code: string) {
      console.warn('Auth warning:', code);
    },
    debug(code: string, metadata: any) {
      console.log('Auth debug:', { code, metadata });
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Initialize NextAuth
const handler = NextAuth(authOptions);

export const { auth, signIn, signOut } = handler;

export default handler;
