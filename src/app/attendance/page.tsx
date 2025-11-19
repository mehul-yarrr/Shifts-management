'use client';

import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';

export default function AttendancePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Attendance</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/attendance/mark">
              <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Mark Attendance</h2>
                <p className="text-gray-600">Record check-in and check-out times for employees</p>
              </div>
            </Link>
            
            <Link href="/attendance/history">
              <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Attendance History</h2>
                <p className="text-gray-600">View attendance records and history</p>
              </div>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

