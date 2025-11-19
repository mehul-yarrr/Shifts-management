'use client';

import React, { useEffect, useState } from 'react';

interface Stats {
  totalEmployees: number;
  totalShifts: number;
  todayAttendance: number;
  upcomingShifts: number;
}

export default function StatsCards() {
  const [stats, setStats] = useState<Stats>({
    totalEmployees: 0,
    totalShifts: 0,
    todayAttendance: 0,
    upcomingShifts: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [employeesRes, shiftsRes, attendanceRes] = await Promise.all([
          fetch('/api/employees'),
          fetch('/api/shifts'),
          fetch('/api/attendance/history'),
        ]);

        const employees = await employeesRes.json();
        const shifts = await shiftsRes.json();
        const attendance = await attendanceRes.json();

        const today = new Date().toISOString().split('T')[0];
        const todayAttendanceCount = attendance.filter(
          (a: any) => a.date.split('T')[0] === today
        ).length;

        const upcomingShiftsCount = shifts.filter(
          (s: any) => new Date(s.date) >= new Date() && s.status === 'scheduled'
        ).length;

        setStats({
          totalEmployees: employees.length,
          totalShifts: shifts.length,
          todayAttendance: todayAttendanceCount,
          upcomingShifts: upcomingShiftsCount,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
            <div className="h-12 w-12 bg-gray-200 rounded-xl mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Employees',
      value: stats.totalEmployees,
      gradient: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      trend: '+12%',
    },
    {
      label: 'Total Shifts',
      value: stats.totalShifts,
      gradient: 'from-green-500 to-emerald-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      trend: '+5%',
    },
    {
      label: "Today's Attendance",
      value: stats.todayAttendance,
      gradient: 'from-yellow-500 to-amber-600',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      trend: 'Today',
    },
    {
      label: 'Upcoming Shifts',
      value: stats.upcomingShifts,
      gradient: 'from-purple-500 to-indigo-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      trend: 'This week',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
        >
          {/* Gradient accent bar */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`}></div>
          
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.iconBg} ${stat.iconColor} p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {stat.trend}
              </span>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </p>
              <div className="flex items-center mt-2">
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${stat.gradient} mr-2 animate-pulse`}></div>
                <span className="text-xs text-gray-500">Active</span>
              </div>
            </div>
          </div>

          {/* Hover effect background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}></div>
        </div>
      ))}
    </div>
  );
}

