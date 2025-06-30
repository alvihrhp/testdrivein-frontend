import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, phone, password } = await request.json();
    
    // Call your registration API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        password,
        role: 'CLIENT',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Registration failed' },
        { status: response.status }
      );
    }

    // Return the user data and token
    return NextResponse.json({
      user: data.user,
      accessToken: data.jwt,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
