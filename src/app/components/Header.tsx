'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from './Button';

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-bold text-blue-600">
              Shift Management
            </Link>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>
            <Link href="/employees" className="text-gray-700 hover:text-blue-600">
              Employees
            </Link>
            <Link href="/shifts" className="text-gray-700 hover:text-blue-600">
              Shifts
            </Link>
            <Link href="/attendance" className="text-gray-700 hover:text-blue-600">
              Attendance
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}

