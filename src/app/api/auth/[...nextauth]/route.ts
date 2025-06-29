import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// @ts-ignore - Using require to avoid TypeScript errors with NextAuth
const NextAuthHandler = require('next-auth').default || require('next-auth');

const handler = NextAuthHandler(authOptions);

export { handler as GET, handler as POST };
