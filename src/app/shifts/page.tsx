'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Table from '../components/Table';
import type { Shift } from '@/types/shift';
import type { Employee } from '@/types/employee';

export default function ShiftsPage() {
  const router = useRouter();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [shiftsRes, employeesRes] = await Promise.all([
        fetch('/api/shifts'),
        fetch('/api/employees'),
      ]);

      if (shiftsRes.ok) {
        const shiftsData = await shiftsRes.json();
        setShifts(shiftsData);
      }

      if (employeesRes.ok) {
        const employeesData = await employeesRes.json();
        setEmployees(employeesData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find((e) => e._id === employeeId);
    return employee?.name || employeeId;
  };

  const columns = [
    {
      header: 'Employee',
      accessor: (row: Shift) => getEmployeeName(row.employeeId),
    },
    {
      header: 'Date',
      accessor: (row: Shift) => new Date(row.date).toLocaleDateString(),
    },
    {
      header: 'Start Time',
      accessor: (row: Shift) => new Date(row.startTime).toLocaleTimeString(),
    },
    {
      header: 'End Time',
      accessor: (row: Shift) => new Date(row.endTime).toLocaleTimeString(),
    },
    { header: 'Location', accessor: 'location' as keyof Shift },
    {
      header: 'Status',
      accessor: (row: Shift) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            row.status === 'completed'
              ? 'bg-green-100 text-green-800'
              : row.status === 'cancelled'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="text-center">Loading...</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Shifts</h1>
            <Link href="/shifts/create">
              <Button>Create Shift</Button>
            </Link>
          </div>
          <div className="bg-white shadow rounded-lg">
            <Table
              data={shifts}
              columns={columns}
              onRowClick={(row) => router.push(`/shifts/${row._id}`)}
              emptyMessage="No shifts found"
            />
          </div>
        </main>
      </div>
    </div>
  );
}

