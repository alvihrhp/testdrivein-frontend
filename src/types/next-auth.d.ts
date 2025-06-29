import NextAuth from 'next-auth';

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
