import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import DashboardHeader from './components/DashboardHeader';
import StatsCards from './components/StatsCards';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 lg:p-10">
          <DashboardHeader />
          <StatsCards />
        </main>
      </div>
    </div>
  );
}

