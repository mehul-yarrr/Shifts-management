import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import DashboardHeader from './components/DashboardHeader';
import StatsCards from './components/StatsCards';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <DashboardHeader />
          <StatsCards />
        </main>
      </div>
    </div>
  );
}

