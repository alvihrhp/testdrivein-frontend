'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui';

interface Stat {
  name: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
}

interface RecentCar {
  id: number;
  name: string;
  price: string;
  status: 'Available' | 'Sold';
}

export default function DashboardPage() {
  const { user } = useAuth();

  const stats: Stat[] = [
    { name: 'Total Revenue', value: 'Rp 1,250,000,000', change: '+12%', changeType: 'positive' },
    { name: 'Cars Sold', value: '45', change: '+8%', changeType: 'positive' },
    { name: 'New Customers', value: '32', change: '+5%', changeType: 'positive' },
    { name: 'Conversion Rate', value: '3.2%', change: '-0.5%', changeType: 'negative' },
  ];

  const recentCars: RecentCar[] = [
    { id: 1, name: 'Toyota Avanza', price: 'Rp 250,000,000', status: 'Available' },
    { id: 2, name: 'Honda HR-V', price: 'Rp 450,000,000', status: 'Sold' },
    { id: 3, name: 'Mitsubishi Xpander', price: 'Rp 280,000,000', status: 'Available' },
  ];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
          <p className="mt-2 text-sm text-gray-600">
            Here's what's happening with your sales today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Cars</CardTitle>
            <CardDescription>
              A list of cars recently added to your inventory.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-gray-200">
              {recentCars.map((car) => (
                <div
                  key={car.id}
                  className="py-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{car.name}</p>
                    <p className="text-sm text-gray-600">{car.price}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      car.status === 'Available'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {car.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
