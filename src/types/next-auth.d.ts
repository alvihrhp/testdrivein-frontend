// @ts-ignore - NextAuth type augmentation
// This file is used for type augmentation and doesn't need to import NextAuth

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: 'CLIENT' | 'SALES';
      token: string;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: 'CLIENT' | 'SALES';
    token: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: {
      id: string;
      name: string;
      email: string;
      role: 'CLIENT' | 'SALES';
      token: string;
    };
  }
}
