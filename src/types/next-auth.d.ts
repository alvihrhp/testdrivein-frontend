// @ts-ignore - NextAuth type augmentation
// This file is used for type augmentation and doesn't need to import NextAuth

type UserRole = 'CLIENT' | 'SALES';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string | null;
      role: UserRole;
    };
    token: string;
  }

  interface User {
    id: string;
    name: string | null;
    email: string | null;
    role: UserRole;
    accessToken: string;
  }
}

import 'next-auth/jwt';

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: 'CLIENT' | 'SALES';
    accessToken?: string;
  }
}
