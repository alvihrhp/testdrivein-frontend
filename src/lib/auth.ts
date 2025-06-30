import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';
import type { DefaultSession, User as NextAuthUser } from 'next-auth/next';
import type { JWT } from 'next-auth/jwt';

interface User extends NextAuthUser {
  id: string;
  role: 'CLIENT' | 'SALES';
  accessToken: string;
}

interface Session extends DefaultSession {
  user: User;
}

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: 'CLIENT' | 'SALES';
      accessToken: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: 'CLIENT' | 'SALES';
    accessToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'CLIENT' | 'SALES';
    accessToken: string;
  }
}

if (!process.env.NEXTAUTH_SECRET) {
  console.warn('NEXTAUTH_SECRET is not set. Please set it in your environment variables.');
}

if (!process.env.NEXT_PUBLIC_API_URL) {
  console.warn('NEXT_PUBLIC_API_URL is not set. Please set it in your environment variables.');
}

// This is the auth configuration that can be used in other files
export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        phone: { label: "Phone", type: "text" },
        isRegister: { label: "Is Register", type: "boolean" }
      },
      async authorize(credentials) { 
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email dan password harus diisi');
        }

        // Handle registration
        if (credentials.isRegister) {
          if (!credentials.name || !credentials.phone) {
            throw new Error('Nama dan nomor telepon harus diisi');
          }

          try {
            const registerResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: credentials.name,
                email: credentials.email,
                phone: credentials.phone,
                password: credentials.password
              }),
            });

            const registerData = await registerResponse.json();

            if (!registerResponse.ok) {
              throw new Error(registerData.error || 'Registrasi gagal');
            }

            // Return the user data to be signed in automatically
            return {
              id: registerData.user.id,
              name: registerData.user.name,
              email: registerData.user.email,
              phone: registerData.user.phone || '',
              role: registerData.user.role || 'CLIENT',
              accessToken: registerData.access_token,
            } as any;
          } catch (error) {
            console.error('Registration error:', error);
            throw new Error('Gagal melakukan registrasi');
          }
        }

        // Handle login
        try {
          console.log('Attempting to authenticate with:', {
            email: credentials.email,
            apiUrl: process.env.NEXT_PUBLIC_API_URL
          });
          
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            }),
          });
          
          const data = await response.json().catch(() => ({}));
          
          console.log('Auth response:', {
            status: response.status,
            statusText: response.statusText,
            data
          });
          
          if (!response.ok) {
            const errorMessage = data.error || 'Login gagal';
            console.error('Authentication failed:', errorMessage);
            throw new Error(errorMessage);
          }
          
          // Return user data with token
          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role || 'CLIENT',
            accessToken: data.access_token,
          };
        } catch (error) {
          console.error('Auth error details:', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
          });
          throw error; // Re-throw to see the error in the client
        }
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }: { token: JWT; user?: User }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    session: ({ session, token }: { session: Session; token: JWT }) => {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : undefined,
      },
    },
  },
  debug: process.env.NODE_ENV === 'development',
};
