import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import LoginForm from './LoginForm';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  
  // Redirect if already logged in
  if (session) {
    redirect('/');
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
