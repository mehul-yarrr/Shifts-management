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
    return <div className="text-center py-8">Loading stats...</div>;
  }

  const statCards = [
    { label: 'Total Employees', value: stats.totalEmployees, color: 'bg-blue-500' },
    { label: 'Total Shifts', value: stats.totalShifts, color: 'bg-green-500' },
    { label: "Today's Attendance", value: stats.todayAttendance, color: 'bg-yellow-500' },
    { label: 'Upcoming Shifts', value: stats.upcomingShifts, color: 'bg-purple-500' },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${stat.color} rounded-md p-3`}>
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.label}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

